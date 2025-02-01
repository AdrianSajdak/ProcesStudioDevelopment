# notification_manager.py

from dataclasses import dataclass
from typing import Optional, List, Union
import logging

from django.db import transaction
from ..models import User, Notification
from ..permissions import RolePermissions

logger = logging.getLogger(__name__)

@dataclass
class NotificationConfig:
    """
    Konfiguracja dla powiadomienia.
    - permission: Klucz uprawnienia, które musi mieć odbiorca, aby dostać powiadomienie.
    - type: Typ powiadomienia (np. 'USER', 'PROJECT', 'VACATION', etc.).
    - title_template: Szablon tytułu, np. "Utworzono nowego użytkownika - {username}".
    - message_template: Szablon wiadomości, np. "New user {username} has been created."
    - recipient: (Opcjonalnie) Jeśli ustawiony – powiadomienie zostanie wysłane tylko do tego użytkownika.
    """
    permission: str
    type: str
    title_template: str
    message_template: str
    recipient: Optional[User] = None

class NotificationManager:
    @staticmethod
    def create_notification(config: NotificationConfig, **kwargs) -> Optional[Union[Notification, List[Notification]]]:
        try:
            title = config.title_template.format(**kwargs)
            message = config.message_template.format(**kwargs)
            
            if config.recipient:
                perms = RolePermissions.get_permissions_for_role(config.recipient.role)
                if perms.get(config.permission, False):
                    notification = Notification.objects.create(
                        recipient=config.recipient,
                        type=config.type,
                        title=title,
                        message=message
                    )
                    return notification
                else:
                    logger.info(f"Użytkownik {config.recipient.username} nie posiada uprawnień '{config.permission}' do otrzymania powiadomienia.")
            else:
                notifications = []
                for user in User.objects.filter(is_active=True):
                    perms = RolePermissions.get_permissions_for_role(user.role)
                    if perms.get(config.permission, False):
                        notifications.append(
                            Notification(
                                recipient=user,
                                type=config.type,
                                title=title,
                                message=message
                            )
                        )
                if notifications:
                    created_notifications = Notification.objects.bulk_create(notifications)
                    return created_notifications
            return None
        except Exception as e:
            logger.error(f"Failed to create notification: {str(e)}", exc_info=True)
            return None
