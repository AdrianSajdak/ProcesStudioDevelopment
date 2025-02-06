import logging
from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Vacation
from ..serializers import VacationSerializer
from ..permissions import RolePermissions
from ..decorators import check_permission
from ..notification import VACATION_NOTIFICATIONS, NotificationConfig, NotificationManager

logger = logging.getLogger(__name__)

# ------------------ VACATION VIEWS ------------------
class VacationViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR VACATIONS (CRUD OPERATIONS)
    """
    serializer_class = VacationSerializer
    queryset = Vacation.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perms = RolePermissions.get_permissions_for_role(self.request.user.role)

        one_year_ago = timezone.now().date() - timedelta(days=365)

        if not perms.get('can_view_all_vacations', False):
            return Vacation.objects.filter(
                assigned_user=self.request.user,
                vacation_date__gte=one_year_ago,
                status__in=['PENDING', 'CONFIRMED']
            )
        return Vacation.objects.filter(vacation_date__gte=one_year_ago, status__in=['PENDING', 'CONFIRMED'])
        
    @check_permission('can_create_vacations', 'No permissions to create vacations.')
    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            response = super().create(request, *args, **kwargs)
            if response.status_code == 201 and request.user.role == 'Employee':
                config = NotificationConfig(
                    permission='can_view_vacation_created_notifications',
                    type='VACATION',
                    title_template=VACATION_NOTIFICATIONS['created']['title'],
                    message_template=VACATION_NOTIFICATIONS['created']['message'],
                    recipient=None
                )
                NotificationManager.create_notification(config, username=request.user.username)
            return response

    @check_permission('can_edit_vacations', 'No permissions to edit vacations.')
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        return super().update(request, *args, partial=partial, **kwargs)

    @check_permission('can_edit_vacations', 'No permissions to edit vacations.')
    def partial_update(self, request, *args, **kwargs):
        vacation = self.get_object()
        with transaction.atomic():
            response = super().partial_update(request, *args, **kwargs)
            if response.status_code in [200, 202]:
                new_status = response.data.get('status')
                if request.user.role == 'Boss' and new_status in ['CONFIRMED', 'REJECTED']:
                    group_id = vacation.vacation_group_id
                    related_vacations = Vacation.objects.filter(vacation_group_id=group_id)
                    related_vacations.update(status=new_status)
                    notification_key = 'confirmed' if new_status == 'CONFIRMED' else 'rejected'
                    config = NotificationConfig(
                        permission='can_view_vacation_updated_notifications',
                        type='VACATION',
                        title_template=VACATION_NOTIFICATIONS[notification_key]['title'],
                        message_template=VACATION_NOTIFICATIONS[notification_key]['message'],
                        recipient=vacation.assigned_user
                    )
                    NotificationManager.create_notification(
                        config,
                        vacation_date=vacation.vacation_date,
                        username=vacation.assigned_user.username
                    )
            return response
    
    @check_permission('can_delete_vacations', 'No permissions to delete vacations.')
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)
    
    @action(detail=False, methods=['GET'], url_path='group/(?P<group_id>[^/.]+)')
    def by_group(self, request, group_id=None):
        """Get vacations by group_id"""
        if not group_id:
            return Response(
                {'error': 'group_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        vacations = self.queryset.filter(
            vacation_group_id=group_id
        ).values('vacation_id', 'vacation_date', 'vacation_group_id')
        
        return Response(vacations)