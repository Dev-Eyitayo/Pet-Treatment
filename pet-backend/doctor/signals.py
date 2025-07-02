from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Certificate
import cloudinary.uploader

@receiver(post_delete, sender=Certificate)
def delete_certificate_file_from_cloudinary(sender, instance, **kwargs):
    # Extract the public_id from the file_url
    if instance.file_url:
        try:
            public_id = instance.file_url.split('/')[-1].split('.')[0]  # crude extraction
            cloudinary.uploader.destroy(f"doctor_certificates/{public_id}")
        except Exception as e:
            print(f"Error deleting from Cloudinary: {e}")
