from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@database_sync_to_async
def get_user(validated_token):
    try:
        user_id = validated_token.get("user_id")
        logger.debug(f"Fetching user with ID: {user_id}")
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} does not exist")
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", [None])[0]
        
        logger.debug(f"Received token: {token}")

        if token:
            try:
                validated_token = UntypedToken(token)
                logger.debug(f"Validated token: {validated_token}")
                scope["user"] = await get_user(validated_token)
                logger.debug(f"User set in scope: {scope['user']}")
            except (InvalidToken, TokenError) as e:
                logger.error(f"Token validation failed: {str(e)}")
                scope["user"] = AnonymousUser()
        else:
            logger.warning("No token provided in query string")
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)