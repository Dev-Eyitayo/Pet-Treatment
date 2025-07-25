from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification

def create_notification(recipient, verb, actor, target):
    notification = Notification.objects.create(
        recipient=recipient,
        verb=verb,
        actor=actor,
        target=target
    )

    # Send via WebSocket to the recipient's group
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{recipient.id}",  # Group name
        {
            'type': 'send_notification',
            'message': {
                'id': notification.id,
                'verb': verb,
                'actor': str(actor),
                'target': target,
                'timestamp': str(notification.timestamp)
            }
        }
    )
