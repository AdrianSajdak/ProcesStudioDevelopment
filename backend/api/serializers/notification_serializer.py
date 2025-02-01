from rest_framework import serializers
from ..models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'notification_id', 'title', 'type',
            'message', 'created_at', 'is_read',
        ]