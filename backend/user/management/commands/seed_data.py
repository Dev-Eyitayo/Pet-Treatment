import os
import uuid
import random
import tempfile
import requests
from django.core.files import File
from django.core.management.base import BaseCommand
from faker import Faker
from user.models import CustomUser
from doctor.models import DoctorProfile
from pets.models import Pet

fake = Faker()

def download_image(url):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            _, ext = os.path.splitext(url)
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=ext or ".jpg")
            for chunk in response.iter_content(1024):
                temp_file.write(chunk)
            temp_file.flush()
            return temp_file.name
    except Exception as e:
        print(f"Image download failed: {e}")
    return None

class Command(BaseCommand):
    help = 'Seed the database with 10 users, 10 doctors, and 10 pets each'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # Clean existing non-admin data
        Pet.objects.all().delete()
        DoctorProfile.objects.all().delete()
        CustomUser.objects.exclude(is_superuser=True).delete()

        species_options = ['dog', 'cat', 'bird', 'other']
        specializations = ['Surgery', 'Dentistry', 'Dermatology', 'General Health', 'Nutrition']
        days = [day for day, _ in DoctorProfile.DAYS_OF_WEEK]

        # Create 10 regular users
        users = []
        for _ in range(10):
            profile_pic_path = download_image(f"https://placekitten.com/200/{random.randint(200,300)}")
            user = CustomUser.objects.create_user(
                email=fake.unique.email(),
                firstname=fake.first_name(),
                lastname=fake.last_name(),
                password="password123",
                role="user"
            )
            if profile_pic_path:
                user.profilepicture.save(f"{uuid.uuid4()}.jpg", File(open(profile_pic_path, "rb")))
                os.remove(profile_pic_path)
            users.append(user)

        self.stdout.write("✅ Created 10 regular users.")

        # Create 10 doctors
        for _ in range(10):
            profile_pic_path = download_image(f"https://placekitten.com/250/{random.randint(250,300)}")
            doctor_user = CustomUser.objects.create_user(
                email=fake.unique.email(),
                firstname=fake.first_name(),
                lastname=fake.last_name(),
                password="password123",
                role="doctor"
            )
            if profile_pic_path:
                doctor_user.profilepicture.save(f"{uuid.uuid4()}.jpg", File(open(profile_pic_path, "rb")))
                os.remove(profile_pic_path)

            available_days = random.sample(days, k=random.randint(3, 6))
            available_times = {
                day: [{"from": "09:00", "to": "17:00"}] for day in available_days
            }

            DoctorProfile.objects.create(
                doctor=doctor_user,
                bio=fake.paragraph(nb_sentences=3),
                specialization=random.choice(specializations),
                available_days=available_days,
                available_times=available_times,
                years_experience=random.randint(1, 10),
                address=fake.address()
            )

        self.stdout.write("✅ Created 10 doctors with profiles.")

        # Create 10 pets for each user
        for user in users:
            for _ in range(1, 4):
                pet_image_url = random.choice([
                    f"https://placekitten.com/300/{random.randint(200, 300)}",
                    f"https://random.dog/{uuid.uuid4().hex}.jpg"  # might fail occasionally
                ])
                pet_image_path = download_image(pet_image_url)

                pet = Pet.objects.create(
                    owner=user,
                    name=fake.first_name(),
                    species=random.choice(species_options),
                    breed=fake.word(),
                    age=random.randint(1, 15)
                )

                if pet_image_path:
                    pet.image.save(f"{uuid.uuid4()}.jpg", File(open(pet_image_path, "rb")))
                    os.remove(pet_image_path)

        self.stdout.write("✅ Created pets for each user.")
        self.stdout.write(self.style.SUCCESS("🎉 Dummy data successfully seeded!"))
