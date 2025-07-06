from .models import Notification

def create_notification(recipient, verb, actor=None, appointment=None, target=None):
    return Notification.objects.create(
        recipient=recipient,
        verb=verb,
        actor=actor,
        target=target,
        appointment=appointment
    )
