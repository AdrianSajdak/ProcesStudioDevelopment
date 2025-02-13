from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification

@receiver(post_save, sender=Notification)
def send_websocket_notification(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{instance.recipient.pk}",
            {
                "type": "send_notification",
                "content": {
                    "notification_id": instance.notification_id,
                    "title": instance.title,
                    "message": instance.message,
                    "type": instance.type,
                    "created_at": instance.created_at.isoformat()
                }
            }
        )