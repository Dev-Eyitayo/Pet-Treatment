from rest_framework import serializers
from .models import Appointment
from pets.models import Pet
from django.contrib.auth import get_user_model
from datetime import datetime, date
from django.utils import timezone

User = get_user_model()

class AppointmentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    doctor = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='doctor'))
    pet = serializers.PrimaryKeyRelatedField(queryset=Pet.objects.all(), allow_null=True)
    
    # Custom fields for frontend
    petName = serializers.CharField(source='pet.name', read_only=True)
    petImage = serializers.CharField(source='pet.image', read_only=True, allow_null=True)
    patientName = serializers.SerializerMethodField()
    doctorName = serializers.CharField(source='doctor.firstname', read_only=True)
    time = serializers.SerializerMethodField()  # Combined date and time

    class Meta:
        model = Appointment
        fields = [
            'id', 'pet', 'petName', 'petImage', 'user', 'patientName', 
            'doctor', 'doctorName', 'title', 'reason', 'date', 'time', 
            'status', 'created_at'
        ]
        read_only_fields = ['created_at', 'petName', 'petImage', 'patientName', 'doctorName', 'time']

    def get_patientName(self, obj):
        return f"{obj.user.firstname} {obj.user.lastname}"

    def get_time(self, obj):
        # Combine date and time into a human-readable format
        appointment_datetime = timezone.make_aware(
            datetime.combine(obj.date, obj.time)
        )
        today = timezone.now().date()
        tomorrow = today + timezone.timedelta(days=1)
        
        if obj.date == today:
            prefix = "Today"
        elif obj.date == tomorrow:
            prefix = "Tomorrow"
        else:
            prefix = obj.date.strftime("%b %d, %Y")
        
        time_str = obj.time.strftime("%I:%M %p").lstrip("0")
        return f"{prefix}, {time_str}"

    def validate(self, data):
        doctor = data['doctor']
        appointment_date = data['date']
        appointment_time = data['time']
        
        # Ensure date is not in the past
        if appointment_date < date.today():
            raise serializers.ValidationError("Cannot schedule appointments in the past.")

        # Validate doctor's availability
        try:
            doctor_profile = doctor.profile
        except User.profile.RelatedObjectDoesNotExist:
            raise serializers.ValidationError("Doctor profile not found.")
        
        available_days = doctor_profile.available_days or []
        available_times = doctor_profile.available_times or {}
        weekday = appointment_date.strftime('%A')

        if weekday not in available_days:
            raise serializers.ValidationError(f"Doctor is not available on {weekday}.")

        available_slots = available_times.get(weekday, [])
        if not available_slots:
            raise serializers.ValidationError(f"Doctor has no available time slots on {weekday}.")

        is_valid_time = False
        for slot in available_slots:
            if not isinstance(slot, dict) or 'from' not in slot or 'to' not in slot:
                raise serializers.ValidationError(f"Invalid time slot format: {slot}")
            
            slot_from = datetime.strptime(slot['from'], '%H:%M').time()
            slot_to = datetime.strptime(slot['to'], '%H:%M').time()

            if slot_from <= appointment_time <= slot_to:
                is_valid_time = True
                break

        if not is_valid_time:
            raise serializers.ValidationError(
                f"Selected time {appointment_time} is not within available slots on {weekday}."
            )

        return data

    def update(self, instance, validated_data):
        request_user = self.context['request'].user

        # Define what fields each role can update
        if request_user == instance.user:
            allowed_fields = {'date', 'time', 'title', 'reason'}
        elif request_user == instance.doctor:
            allowed_fields = {'status'}
        else:
            raise serializers.ValidationError("You do not have permission to update this appointment.")

        # Reject any field not in allowed_fields
        for field in validated_data:
            if field not in allowed_fields:
                raise serializers.ValidationError(f"You cannot update the '{field}' field.")

        return super().update(instance, validated_data)