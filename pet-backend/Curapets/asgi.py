import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Curapets.settings')
django.setup() 

from channels.auth import AuthMiddlewareStack
from notifications.middleware import JWTAuthMiddleware 
from notifications.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(  
        URLRouter(websocket_urlpatterns)
    ),
})
