from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated  
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Notification
from ..serializers import NotificationSerializer

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