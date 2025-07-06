from django.db import models
from django.contrib.auth import get_user_model
from appointments.models import Appointment

User = get_user_model()

class Notification(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    verb = models.CharField(max_length=255) 
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    target = models.CharField(max_length=255, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.actor} {self.verb} appointment for {self.target}"
