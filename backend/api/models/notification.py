from django.db import models
from django.conf import settings

class Notification(models.Model):
    """
    NOTIFICATION MODEL FOR STORING NOTIFICATIONS
    """
    NOTIFICATION_TYPE_CHOICES = (
        ('VACATION', 'VACATION'),
        ('TASK', 'TASK'),
        ('PROJECT', 'PROJECT'),
        ('PHASE', 'PHASE'),
        ('USER', 'USER'),
        ('CLIENT', 'CLIENT'),
    )
    notification_id = models.AutoField(primary_key=True)

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        blank=True,
        null=True
    )

    type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPE_CHOICES
    )
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification #{self.notification_id} [{self.type}]"