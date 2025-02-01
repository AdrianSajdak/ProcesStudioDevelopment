import logging
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Task
from ..serializers import TaskSerializer
from ..permissions import RolePermissions
from ..decorators import check_permission
from ..notification import TASK_NOTIFICATIONS, NotificationConfig, NotificationManager

logger = logging.getLogger(__name__)

# ------------------ TASK VIEWS ------------------
class TaskViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR TASKS (CRUD OPERATIONS)
    """
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perms = RolePermissions.get_permissions_for_role(self.request.user.role)
        one_year_ago = timezone.now().date() - timedelta(days=365)
    
        if not perms.get('can_view_all_tasks', False):
            return Task.objects.filter(
                assigned_user=self.request.user,
                created_date__gte=one_year_ago
            )
        return Task.objects.filter(created_date__gte=one_year_ago)
    
    @check_permission('can_create_tasks', 'No permissions to create tasks.')
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                task = serializer.save(author=self.request.user)
                if task and task.assigned_user:
                    config = NotificationConfig(
                        permission='can_view_task_created_notifications',
                        type='TASK',
                        title_template=TASK_NOTIFICATIONS['created']['title'],
                        message_template=TASK_NOTIFICATIONS['created']['message'],
                        recipient=task.assigned_user
                    )
                    NotificationManager.create_notification(config, username=task.assigned_user.username)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error during task creation: {e}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    # TO MOŻE BYĆ NIEPOTRZEBNE
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @check_permission('can_edit_tasks', 'No permissions to edit tasks.')
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        return super().update(request, *args, partial=partial, **kwargs)

    @check_permission('can_edit_tasks', 'No permissions to edit tasks.')
    def partial_update(self, request, *args, **kwargs):
        task = self.get_object()
        old_status = task.status
        with transaction.atomic():
            response = super().partial_update(request, *args, **kwargs)
            if response.status_code in [200, 202] and old_status != response.data.get('status'):
                config = NotificationConfig(
                    permission='can_view_task_updated_notifications',
                    type='TASK',
                    title_template=TASK_NOTIFICATIONS['status_changed']['title'],
                    message_template=TASK_NOTIFICATIONS['status_changed']['message'],
                    recipient=task.assigned_user
                )
                NotificationManager.create_notification(config, task_name=task.name, old_status=old_status, new_status=response.data.get('status'))
            return response

    @check_permission('can_delete_tasks', 'No permissions to delete tasks.')
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)
    
    def retrieve(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_view_all_tasks', False):
            obj = get_object_or_404(Task, pk=pk)
            if obj.assigned_user != request.user:
                return Response({
                    "detail": "You don't have permissions to view this task."
                    }, status=status.HTTP_403_FORBIDDEN)
        return super().retrieve(request, pk)
    
    def perform_update(self, serializer):
        original_task = self.get_object()
        original_status = original_task.status
        
        task = serializer.save()
        
        if original_status != 'CLOSED' and task.status == 'CLOSED':
            task.end_date = timezone.now()
            task.save()