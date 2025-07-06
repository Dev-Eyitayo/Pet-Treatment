from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Appointment
from notifications.utils import create_notification

@receiver(post_save, sender=Appointment)
def handle_appointment_notifications(sender, instance, created, **kwargs):
    user = instance.user
    doctor = instance.doctor

    # Notify doctor when a user books an appointment
    if created:
        create_notification(
            recipient=doctor,
            verb="booked an appointment",
            actor=user,
            target=f"for {instance.pet.name if instance.pet else 'a pet'} on {instance.date} at {instance.time}"
        )

    # Notify user if appointment status changes to accepted or rejected
    elif instance.status in ['accepted', 'rejected']:
        create_notification(
            recipient=user,
            verb=f"{instance.status} your appointment",
            actor=doctor,
            target=f"on {instance.date} at {instance.time}"
        )
