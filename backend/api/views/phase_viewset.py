import logging
from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from ..models import Phase
from ..serializers import PhaseSerializer
from ..permissions import RolePermissions
from ..decorators import check_permission
from ..notification import PHASE_NOTIFICATIONS, NotificationConfig, NotificationManager

logger = logging.getLogger(__name__)

# ------------------ PHASE VIEWS ------------------
class PhaseViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR PHASES (CRUD OPERATIONS)
    """
    serializer_class = PhaseSerializer
    permission_classes = [IsAuthenticated]
    queryset = Phase.objects.all()
    
    def get_queryset(self):
        perms = RolePermissions.get_permissions_for_role(self.request.user.role)
        one_year_ago = timezone.now().date() - timedelta(days=365)

        if not perms.get('can_view_phases', False):
            return Phase.objects.none()

        queryset = Phase.objects.filter(
            assigned_project__created_date__gte=one_year_ago
        )

        assigned_project_id  = self.request.query_params.get('assigned_project', None)
        if assigned_project_id  is not None:
            queryset = queryset.filter(assigned_project_id=assigned_project_id )

        return queryset
    
    @check_permission('can_view_phases', 'No permissions to view phases.')
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @check_permission('can_create_phases', 'No permissions to create phases.')
    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            response = super().create(request, *args, **kwargs)
            if response.status_code == 201:
                phase_name = response.data.get('name')
                config = NotificationConfig(
                    permission='can_view_phase_created_notifications',
                    type='PHASE',
                    title_template=PHASE_NOTIFICATIONS['created']['title'],
                    message_template=PHASE_NOTIFICATIONS['created']['message'],
                    recipient=None
                )
                NotificationManager.create_notification(config, phase_name=phase_name)
            return response

    @check_permission('can_edit_phases', 'No permissions to edit phases.')
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        return super().update(request, partial=partial, *args, **kwargs)

    @check_permission('can_edit_phases', 'No permissions to edit phases.')
    def partial_update(self, request, *args, **kwargs):
        phase = self.get_object()
        old_status = phase.status

        with transaction.atomic():
            response = super().partial_update(request, *args, **kwargs)
            if response.status_code in [200, 202] and old_status != response.data.get('status'):
                config = NotificationConfig(
                    permission='can_view_phase_updated_notifications',
                    type='PHASE',
                    title_template=PHASE_NOTIFICATIONS['status_changed']['title'],
                    message_template=PHASE_NOTIFICATIONS['status_changed']['message'],
                    recipient=None
                )
                NotificationManager.create_notification(config, phase_name=phase.name, old_status=old_status, new_status=response.data.get('status'))
            return response
    
    @check_permission('can_delete_phases', 'No permissions to delete phases.')
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)
    
    @check_permission('can_view_phases', 'No permissions to view phases.')
    def retrieve(self, request, pk=None):
        return super().retrieve(request, pk)
