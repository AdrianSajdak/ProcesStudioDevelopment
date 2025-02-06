import logging
from django.db import transaction
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..serializers import RegisterSerializer
from ..decorators import check_permission
from ..notification import USER_NOTIFICATIONS, NotificationConfig, NotificationManager
import os
import uuid

logger = logging.getLogger(__name__)

def generate_unique_filename(filename):
    ext = os.path.splitext(filename)[1]
    return f"{uuid.uuid4()}{ext}"

# ------------------ REGISTRATION ------------------
class RegisterView(generics.CreateAPIView):
    """
    VIEW FOR REGISTERING NEW USERS
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RegisterSerializer

    @check_permission('can_create_users', 'No permissions to create users.')
    def post(self, request, *args, **kwargs):
        if 'profile_picture' in request.FILES:
            file = request.FILES['profile_picture']
            file.name = generate_unique_filename(file.name)
        if 'contract_file' in request.FILES:
            file = request.FILES['contract_file']
            file.name = generate_unique_filename(file.name)

        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                user = serializer.save()
                config = NotificationConfig(
                    permission='can_view_user_created_notifications',
                    type='USER',
                    title_template=USER_NOTIFICATIONS['created']['title'],
                    message_template=USER_NOTIFICATIONS['created']['message'],
                    recipient=None
                )
                NotificationManager.create_notification(config, username=user.username)
            return Response({'message': 'Rejestracja zakończona powodzeniem.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error during user registration: {e}")
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
