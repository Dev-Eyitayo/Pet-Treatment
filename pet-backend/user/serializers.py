from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import get_user_model

from django.core.validators import validate_email
from django.core.exceptions import ValidationError


ALLOWED_SIGNUP_ROLES = ['user', 'doctor'] 
User = get_user_model()
class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=ALLOWED_SIGNUP_ROLES, required=False)

    class Meta:
        model = CustomUser
        fields = ['email', 'firstname', 'lastname', 'password', 'role']

    def create(self, validated_data):
        role = validated_data.get('role', 'user')

        if role not in ALLOWED_SIGNUP_ROLES:
            raise serializers.ValidationError({"role": "Invalid role selection."})

        return CustomUser.objects.create_user(
            email=validated_data['email'],
            firstname=validated_data['firstname'],
            lastname=validated_data['lastname'],
            password=validated_data['password'],
            role=role
        )
        
        
        
        


class UserSerializer(serializers.ModelSerializer):
    profilepicture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'firstname', 'lastname', 'profilepicture', 'role', 'created_at']
        read_only_fields = ['id', 'role', 'created_at']

    def validate_email(self, value):
        # Ensure email is unique, excluding the current user
        user = self.context['request'].user
        if CustomUser.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_firstname(self, value):
        if len(value) > 50:
            raise serializers.ValidationError("First name must be 50 characters or fewer.")
        return value

    def validate_lastname(self, value):
        if len(value) > 50:
            raise serializers.ValidationError("Last name must be 50 characters or fewer.")
        return value

    def validate_profilepicture(self, value):
        if value:
            # Validate file type
            allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError(
                    "Profile picture must be a valid image (jpg, png, gif, webp)."
                )
            # Validate file size (5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    "Profile picture size must be less than 5MB."
                )
        return value

    def update(self, instance, validated_data):
        # Handle profilepicture clearing
        if 'profilepicture' in validated_data and validated_data['profilepicture'] is None:
            instance.profilepicture.delete(save=False)  # Remove existing file
            instance.profilepicture = None
        return super().update(instance, validated_data)        
        

    def get_profilepicture(self, obj):
        if obj.profilepicture:
            return obj.profilepicture.url
        return '/media/defaults/default_profile.png'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Get default token (with access and refresh)
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['firstname'] = user.firstname
        token['lastname'] = user.lastname
        token['role'] = user.role

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # send user data in the response
        data.update({
            'id': str(self.user.id),
            'email': self.user.email,
            'firstname': self.user.firstname,
            'lastname': self.user.lastname,
            'role': self.user.role,
        })

        return data



class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.IntegerField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = User.objects.get(pk=data['uid'])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid user ID.")
        
        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("Invalid or expired token.")
        
        return data