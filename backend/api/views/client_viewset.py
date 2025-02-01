import logging
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Client
from ..serializers import ClientSerializer
from ..permissions import RolePermissions
from ..decorators import check_permission
from ..notification import CLIENT_NOTIFICATIONS, NotificationConfig, NotificationManager

logger = logging.getLogger(__name__)

# ------------------ CLIENT VIEWS ------------------
class ClientViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR CLIENTS (CRUD OPERATIONS)
    """
    serializer_class = ClientSerializer
    queryset = Client.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perms = RolePermissions.get_permissions_for_role(self.request.user.role)
        if perms.get('can_view_clients', False):
            return Client.objects.all()
        else:
            return Client.objects.none()
    
    @check_permission('can_create_clients', 'No permissions to create clients.')
    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            response = super().create(request, *args, **kwargs)
            if response.status_code == 201:
                client_name = response.data.get('name')
                config = NotificationConfig(
                    permission='can_view_client_created_notifications',
                    type='CLIENT',
                    title_template=CLIENT_NOTIFICATIONS['created']['title'],
                    message_template=CLIENT_NOTIFICATIONS['created']['message'],
                    recipient=None
                )
                NotificationManager.create_notification(config, client_name=client_name)
            return response
    
    @check_permission('can_edit_clients', 'No permissions to edit clients.')
    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            response = super().update(request, *args, **kwargs)
            if response.status_code in [200, 202]:
                client_name = response.data.get('name')
                config = NotificationConfig(
                    permission='can_view_client_updated_notifications',
                    type='CLIENT',
                    title_template=CLIENT_NOTIFICATIONS['updated']['title'],
                    message_template=CLIENT_NOTIFICATIONS['updated']['message'],
                    recipient=None
                )
                NotificationManager.create_notification(config, client_name=client_name)
            return response


    @check_permission('can_edit_clients', 'No permissions to edit clients.')
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @check_permission('can_delete_clients', 'No permissions to delete clients.')
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)
    
    @check_permission('can_view_clients', 'No permissions to view clients.')    
    def retrieve(self, request, pk=None):
        return super().retrieve(request, pk)
    