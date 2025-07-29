import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from notifications.middleware import JWTAuthMiddleware  
from notifications.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Curapets.settings')
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        JWTAuthMiddleware(
            URLRouter(websocket_urlpatterns)
        )
    ),
})


# asgi.py

# from channels.routing import ProtocolTypeRouter, URLRouter
# from notifications.middleware import JWTAuthMiddleware
# from notifications.routing import websocket_urlpatterns

# application = ProtocolTypeRouter({
#     "websocket": JWTAuthMiddleware(
#         URLRouter(websocket_urlpatterns)
#     ),
# })
