from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import DoctorProfile, DoctorApplication
from .serializers import DoctorProfileSerializer, DoctorApplicationSerializer
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import action
import json
from rest_framework.permissions import AllowAny, IsAuthenticated
from utils.auth import get_safe_user
from rest_framework.views import APIView
import cloudinary
import time


class GenerateCloudinarySignatureView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        timestamp = int(time.time())
        folder = request.query_params.get("folder", "misc_uploads")

        # Optional: restrict allowed folders for security
        allowed_folders = ["doctor_certificates", "profile_pictures"]
        if folder not in allowed_folders:
            return Response({"error": "Invalid folder name."}, status=400)

        params_to_sign = {
            "timestamp": timestamp,
            "folder": folder,
        }

        signature = cloudinary.utils.api_sign_request(
            params_to_sign, settings.CLOUDINARY_API_SECRET  # use from settings
        )

        return Response({
            "timestamp": timestamp,
            "signature": signature,
            "api_key": settings.CLOUDINARY_API_KEY,
            "cloud_name": settings.CLOUDINARY_CLOUD_NAME,  # fixed here
            "folder": folder
        })

class DoctorApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
            submitted = hasattr(request.user, 'doctor_application')
            return Response({"submitted": submitted})


class DoctorApplicationViewSet(viewsets.ModelViewSet):
    queryset = DoctorApplication.objects.all()
    serializer_class = DoctorApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = get_safe_user(self)
        if not user:
            return DoctorApplication.objects.none()
        
        if user.is_staff:
            return DoctorApplication.objects.all()
        return DoctorApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Removed redundant validation; rely on serializer
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied("You cannot update a doctor application.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied("You cannot update a doctor application.")
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def review(self, request, pk=None):
        application = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        status_value = serializer.validated_data['status']

        if application.status in ['approved', 'rejected']:
            return Response({"detail": f"Application is already {application.status}."}, status=400)

        with transaction.atomic():
            application.status = status_value
            application.save()

            if status_value == 'approved':
                application.user.role = 'doctor'
                application.user.save()

            elif status_value == 'rejected':
                # delete the certificates and files from Cloudinary
                for cert in application.certificate_files.all():
                    try:
                        public_id = cert.file_url.split('/')[-1].split('.')[0]
                        cloudinary.uploader.destroy(f"doctor_certificates/{public_id}")
                        cert.delete()
                    except Exception as e:
                        print(f"Error cleaning certificate: {e}")

        return Response({"detail": f"Application {status_value} successfully."})




class DoctorProfileViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # Allow all users to view profiles
        return [IsAuthenticated()]  # Require authentication for create/update/delete

    def get_object(self):
        if self.kwargs.get('pk') == 'me':
            if self.request.user.is_authenticated and self.request.user.role != 'doctor':
                raise PermissionDenied("Only doctors can access their own profiles via 'me'.")
            try:
                return DoctorProfile.objects.get(doctor=self.request.user)
            except DoctorProfile.DoesNotExist:
                raise NotFound("Doctor profile not found.")
        return super().get_object()

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)  # Allow all profiles to be listed

    def perform_create(self, serializer):
        if self.request.user.role != 'doctor':
            raise PermissionDenied("Only doctors can create doctor profiles.")
        serializer.save(doctor=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.doctor != request.user and not request.user.is_staff:
            raise PermissionDenied("You can only update your own profile.")

        # Extract doctor data
        doctor_data = {
            'bio': request.data.get('bio'),
            'specialization': request.data.get('specialization'),
            'years_experience': request.data.get('years_experience'),
            'address': request.data.get('address'),
            'available_days': request.data.get('available_days'),
            'available_times': request.data.get('available_times'),
        }

        # Parse JSON strings if necessary
        if isinstance(doctor_data.get('available_days'), str):
            try:
                doctor_data['available_days'] = json.loads(doctor_data['available_days'])
            except json.JSONDecodeError:
                return Response(
                    {"available_days": "Invalid JSON format for available_days"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if isinstance(doctor_data.get('available_times'), str):
            try:
                doctor_data['available_times'] = json.loads(doctor_data['available_times'])
            except json.JSONDecodeError:
                return Response(
                    {"available_times": "Invalid JSON format for available_times"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Validate and update DoctorProfile model
        serializer = self.get_serializer(instance, data=doctor_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.doctor != request.user and not request.user.is_staff:
            raise PermissionDenied("You can only delete your own profile.")
        return super().destroy(request, *args, **kwargs)