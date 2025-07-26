import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Curapets.settings")
django.setup()

from datetime import date, time
from appointments.models import Appointment
from notifications.models import Notification
from user.models import CustomUser as User  
from pets.models import Pet

# Clear old test data
User.objects.filter(email__in=["patient@test.com", "doctor@test.com"]).delete()
Notification.objects.all().delete()

# Create test users (add required firstname and lastname)
patient = User.objects.create_user(
    email="patient2@test.com",
    password="1234",
    firstname="John",
    lastname="Doe",
    role="user"
)

doctor = User.objects.create_user(
    email="doctor2@test.com",
    password="1234",
    firstname="Dr.",
    lastname="Smith",
    role="doctor"
)

# Create a pet
pet = Pet.objects.create(name="Bella", species="Dog", owner=patient, age=2)

# Create an appointment (should notify doctor)
appointment = Appointment.objects.create(
    user=patient,
    doctor=doctor,
    pet=pet,
    title="Vaccination Check",
    reason="Testing notifications",
    date=date.today(),
    time=time(hour=10, minute=0)
)

print("\n--- Doctor's Notifications ---")
for note in doctor.notifications.all():
    print(f"{note.timestamp} - {note.actor} {note.verb} {note.target}")

# Update status to 'accepted' (should notify patient)
appointment.status = 'accepted'
appointment.save()

print("\n--- Patient's Notifications ---")
for note in patient.notifications.all():
    print(f"{note.timestamp} - {note.actor} {note.verb} {note.target}")
