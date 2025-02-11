from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated  
from rest_framework.response import Response
from rest_framework.decorators import action, authentication_classes, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.cache import cache
import uuid
from ..models import Notification
from ..serializers import NotificationSerializer
import logging
from django.conf import settings
from cryptography.fernet import Fernet

logger = logging.getLogger(__name__)

cipher = Fernet(settings.FERNET_KEY)

# ------------------ NOTIFICATION VIEWS ------------------ 

class NotificationViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR NOTIFICATIONS
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()

    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.exclude(is_read=True)
        return queryset.filter(recipient=user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        return Response(
            {'detail': 'Creating notifications via this endpoint is not allowed.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    @action(detail=True, methods=['patch'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()

        return Response({'detail': 'Notification marked as read.'}, status=status.HTTP_200_OK)
    
    @action(
        detail=False,
        methods=['get'],
        authentication_classes=[JWTAuthentication],
        permission_classes=[IsAuthenticated]
    )
    def get_ws_token(self, request):
        try:
            ws_token = str(uuid.uuid4())
            encrypted_token = cipher.encrypt(ws_token.encode()).decode()  # Szyfruj token
            
            cache.set(
                f"ws_token_{ws_token}",  # Używaj nieszyfrowanego klucza
                {"user_id": request.user.user_id},
                timeout=300
            )
            return Response({"ws_token": encrypted_token})  # Zwróć zaszyfrowany token
        except Exception as e:
            logger.error(f"Error generating WS token: {str(e)}")
            return Response({"detail": "Internal server error"}, status=500)