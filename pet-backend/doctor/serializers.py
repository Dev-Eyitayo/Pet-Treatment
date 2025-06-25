from rest_framework import serializers
from user.serializers import UserSerializer
from .models import DoctorProfile, DoctorApplication, Certificate
import datetime
from django.core.exceptions import ValidationError
import os
from django.db import transaction
from django.contrib.auth import get_user_model
from user.serializers import UserSerializer

def validate_file_extension(file):
    ext = os.path.splitext(file.name)[1].lower()
    valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
    if ext not in valid_extensions:
        raise ValidationError('Unsupported file extension. Allowed: PDF, JPG, PNG.')
    max_size = 5 * 1024 * 1024  # 5MB
    if file.size > max_size:
        raise ValidationError('File size exceeds 5MB limit.')

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ['id', 'file', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

class DoctorApplicationSerializer(serializers.ModelSerializer):
    certificate_files = CertificateSerializer(many=True, read_only=True)
    certificates = serializers.ListField(
        child=serializers.FileField(validators=[validate_file_extension]),
        write_only=True,
        required=True
    )

    class Meta:
        model = DoctorApplication
        fields = ['id', 'user', 'bio', 'specialization', 'certificates', 'certificate_files', 'status', 'submitted_at']
        read_only_fields = ['id', 'user', 'status', 'submitted_at', 'certificate_files']

    def validate(self, data):
        if not data.get('certificates'):
            raise serializers.ValidationError({"certificates": "At least one certificate is required."})
        if len(data['certificates']) > 5:
            raise serializers.ValidationError({"certificates": "Cannot upload more than 5 certificates."})
        return data

    def to_internal_value(self, data):
        data = data.copy()  # Create mutable copy
        if 'certificates[]' in data:
            data.setlist('certificates', data.getlist('certificates[]'))
            data.pop('certificates[]', None)
        return super().to_internal_value(data)

    def create(self, validated_data):
        from django.db import transaction
        with transaction.atomic():
            certificates = validated_data.pop('certificates', [])
            user = self.context['request'].user
            if hasattr(user, 'doctor_application'):
                raise serializers.ValidationError({"non_field_errors": "Application already submitted."})
            application = DoctorApplication.objects.create(user=user, **validated_data)
            for file in certificates:
                Certificate.objects.create(application=application, file=file)
            return application

class ReviewSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['approved', 'rejected'])

class DoctorProfileSerializer(serializers.ModelSerializer):
    available_times = serializers.JSONField()
    available_days = serializers.MultipleChoiceField(
        choices=DoctorProfile.DAYS_OF_WEEK,
        allow_empty=True
    )
    doctor = UserSerializer(read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'doctor', 'bio', 'specialization',
            'available_days', 'available_times', 'address',
            'years_experience', 'created_at'
        ]
        read_only_fields = ['doctor', 'created_at']

    def validate_available_days(self, value):
        # Value is already a list of valid choices due to MultipleChoiceField
        return list(value)  # Ensure it's a list for MultiSelectField

    def validate_available_times(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("available_times must be a dictionary with days as keys.")
        
        valid_days = [day for day, _ in DoctorProfile.DAYS_OF_WEEK]
        for day, time_slots in value.items():
            if day not in valid_days:
                raise serializers.ValidationError(f"'{day}' is not a valid day of the week.")
            if not isinstance(time_slots, list):
                raise serializers.ValidationError(f"Time slots for {day} must be a list.")
            for slot in time_slots:
                if not isinstance(slot, dict) or 'from' not in slot or 'to' not in slot:
                    raise serializers.ValidationError(
                        f"Each time slot for {day} must be a dict with 'from' and 'to' keys."
                    )
                try:
                    from_time = datetime.datetime.strptime(slot['from'], "%H:%M").time()
                    to_time = datetime.datetime.strptime(slot['to'], "%H:%M").time()
                except ValueError:
                    raise serializers.ValidationError(
                        f"Time format for {day} must be 'HH:MM'. Got: {slot}"
                    )
                if from_time >= to_time:
                    raise serializers.ValidationError(
                        f"'from' time must be earlier than 'to' time on {day}."
                    )
            # Check for overlapping slots
            sorted_slots = sorted(
                [(datetime.datetime.strptime(slot['from'], "%H:%M").time(),
                  datetime.datetime.strptime(slot['to'], "%H:%M").time())
                 for slot in time_slots],
                key=lambda x: x[0]
            )
            for i in range(1, len(sorted_slots)):
                prev_end = sorted_slots[i - 1][1]
                curr_start = sorted_slots[i][0]
                if curr_start < prev_end:
                    raise serializers.ValidationError(
                        f"Overlapping time slots found on {day}."
                    )
        return value

    def validate(self, data):
        available_days = data.get('available_days', [])
        available_times = data.get('available_times', {})
        invalid_days = [day for day in available_times if day not in available_days]
        if invalid_days:
            raise serializers.ValidationError({
                "available_times": f"Time slots set for days not in available_days: {', '.join(invalid_days)}"
            })
        return data