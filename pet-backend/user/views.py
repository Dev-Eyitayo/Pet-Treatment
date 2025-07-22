from rest_framework import generics, status
from .models import CustomUser
from rest_framework.response import Response
from .serializers import (
    SignUpSerializer,
    CustomTokenObtainPairSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetSerializer,
    UserSerializer
)
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class SignUpView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PasswordResetRequestView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = PasswordResetSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            email = serializer.validated_data['email']
            user = User.objects.get(email=email)

            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = user.pk

            reset_url = f"{settings.SITE_PROTOCOL}://{settings.SITE_DOMAIN}/reset-password/{uid}/{token}/"

            # Compose plain text email content
            message = (
                f"Hi {user.firstname},\n\n"
                f"You requested a password reset. Please use the link below to reset your password:\n\n"
                f"{reset_url}\n\n"
                "If you did not make this request, you can safely ignore this email.\n\n"
                "Thank you."
            )

            send_mail(
                subject='Password Reset Request',
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

            return Response({"detail": "Password reset link sent."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetConfirmView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        try:
            serializer = PasswordResetConfirmSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            user = User.objects.get(pk=serializer.validated_data['uid'])
            user.set_password(serializer.validated_data['new_password'])
            user.save()

            return Response(
                {"detail": "Password reset successful."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"detail": "Failed to reset password."},
                status=status.HTTP_400_BAD_REQUEST
            )
