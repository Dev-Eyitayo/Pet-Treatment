from channels.generic.websocket import AsyncWebsocketConsumer
import json
import logging

logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        logger.debug(f"WebSocket connection attempt by user: {user}")
        if user.is_authenticated:
            self.group_name = f"user_{user.id}"
            logger.info(f"User {user.id} connected to group {self.group_name}")
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            logger.warning("Unauthorized WebSocket connection attempt")
            await self.close(code=403)

    async def disconnect(self, close_code):
        logger.debug(f"WebSocket disconnected with code: {close_code}")
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        logger.debug(f"Sending notification: {event['message']}")
        await self.send(text_data=json.dumps(event['message']))