from django.db import models
from django.conf import settings
from pets.models import Pet

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor_appointments'
    )
    pet = models.ForeignKey(
        Pet, 
        on_delete=models.CASCADE, 
        related_name='appointments', 
        null=True, 
        blank=True
    )
    title = models.CharField(max_length=100, blank=True)  # New field for appointment title (e.g., "Annual Checkup")
    reason = models.TextField(blank=True)  # Renamed 'description' to 'reason' for clarity
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('doctor', 'date', 'time')  # Prevent double-booking

    def __str__(self):
        return f"{self.title or 'Appointment'} on {self.date} at {self.time} with Dr. {self.doctor.firstname}"