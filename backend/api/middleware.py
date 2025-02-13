import os
from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from channels.middleware import BaseMiddleware
from cryptography.fernet import Fernet
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
import logging

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'processtudio.settings')
logger = logging.getLogger(__name__)

cipher = Fernet(settings.FERNET_KEY)

class WebSocketTokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        try:
            query_params = scope.get("query_string", b"").decode()
            encrypted_token  = dict(param.split("=") for param in query_params.split("&") if "=" in param).get("token")
            
            if encrypted_token:
                try:
                    ws_token = cipher.decrypt(encrypted_token.encode()).decode()
                    logger.info(f"Deszyfrowany ws_token: {ws_token}")
                    cached_data = cache.get(f"ws_token_{ws_token}")
                    logger.info(f"Cached data: {cached_data}")
                    if cached_data:
                        user = await self.get_user(cached_data["user_id"])
                        scope["user"] = user
                        cache.delete(f"ws_token_{ws_token}")
                    else:
                        scope["user"] = AnonymousUser()
                except Exception as e:
                    logger.error("Błąd deszyfrowania tokena", exc_info=True)
                    scope["user"] = AnonymousUser()
            else:
                scope["user"] = AnonymousUser()
        except Exception as e:
            logger.error(f"Middleware error: {str(e)}")
            scope["user"] = AnonymousUser()
        
        return await super().__call__(scope, receive, send)

    async def get_user(self, user_id):
        return await get_user_model().objects.aget(pk=user_id)
    
class JWTAuthLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if response.status_code == 401:
            logger.warning(f"Unauthorized access attempt to {request.path}")
        return response