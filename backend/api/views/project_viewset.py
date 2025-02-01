import logging
from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from ..models import Project, Phase, Task
from ..serializers import ProjectSerializer
from ..permissions import RolePermissions
from ..decorators import check_permission
from ..notification import PROJECT_NOTIFICATIONS, NotificationConfig, NotificationManager

logger = logging.getLogger(__name__)

# ------------------ PROJECT VIEWS ------------------
class ProjectViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR PROJECTS (CRUD OPERATIONS)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        one_year_ago = timezone.now().date() - timedelta(days=365)
        return Project.objects.filter(created_date__gte=one_year_ago)

    @check_permission('can_view_projects', 'No permissions to view projects.')
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @check_permission('can_create_projects', 'No permissions to create projects.')
    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            response = super().create(request, *args, **kwargs)
            if response.status_code == 201:
                project_name = response.data.get('name')
                config = NotificationConfig(
                    permission='can_view_project_created_notifications',
                    type='PROJECT',
                    title_template=PROJECT_NOTIFICATIONS['created']['title'],
                    message_template=PROJECT_NOTIFICATIONS['created']['message'],
                    recipient=None
                )
                NotificationManager.create_notification(config, project_name=project_name)
            return response
    
    @check_permission('can_view_projects', 'No permissions to view projects.')
    def retrieve(self, request, pk=None):
        return super().retrieve(request, pk)

    @check_permission('can_edit_projects', 'No permissions to edit projects.')
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        return super().update(request, partial=partial, *args, **kwargs)

    @check_permission('can_edit_projects', 'No permissions to edit projects.')
    def partial_update(self, request, *args, **kwargs):
        project = self.get_object()
        old_status = project.status

        with transaction.atomic():
            response = super().partial_update(request, *args, **kwargs)
            if response.status_code in [200, 202]:
                new_status = response.data.get('status')
                project_name = response.data.get('name')
                if old_status != new_status:
                    config = NotificationConfig(
                        permission='can_view_project_updated_notifications',
                        type='PROJECT',
                        title_template=PROJECT_NOTIFICATIONS['status_changed']['title'],
                        message_template=PROJECT_NOTIFICATIONS['status_changed']['message'],
                        recipient=None
                    )
                    NotificationManager.create_notification(config, old_status=old_status, new_status=new_status, project_name=project_name)
            return response

    @check_permission('can_delete_projects', 'No permissions to delete projects.')
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)
    
    def perform_update(self, serializer):
        """
        After updating the project, if the status is CLOSED,
        close all phases and tasks that are not yet closed.
        """
        with transaction.atomic():
            project = serializer.save()
            if project.status == 'CLOSED':
                Phase.objects.filter(assigned_project=project).exclude(status='CLOSED').update(status='CLOSED')
                Task.objects.filter(assigned_project=project).exclude(status='CLOSED').update(status='CLOSED')
