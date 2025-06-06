# doctor_profile/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied
from .models import DoctorProfile, DoctorApplication
from .serializers import DoctorProfileSerializer, DoctorApplicationSerializer
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes

User = get_user_model()

class DoctorApplicationViewSet(viewsets.ModelViewSet):
    queryset = DoctorApplication.objects.all()
    serializer_class = DoctorApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return DoctorApplication.objects.all()
        return DoctorApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Check if the user already has a doctor application
        if DoctorApplication.objects.filter(user=self.request.user).exists():
            raise ValidationError("You have already submitted an application.")
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
        status_value = request.data.get('status')

        if status_value not in ['approved', 'rejected']:
            return Response({"detail": "Invalid status."}, status=400)

        application.status = status_value
        application.save()

        if status_value == 'approved':
            application.user.role = 'doctor'
            application.user.save()

        return Response({"detail": f"Application {status_value} successfully."})






# class DoctorProfileViewSet(viewsets.ModelViewSet):
#     queryset = DoctorProfile.objects.all()
#     serializer_class = DoctorProfileSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]

#     def perform_create(self, serializer):
#         if self.request.user.role != 'doctor':
#             raise PermissionDenied("Only doctors can create doctor profiles.")
#         serializer.save(doctor=self.request.user)

#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         if instance.doctor != request.user:
#             raise PermissionDenied("You can only update your own profile.")
#         return super().update(request, *args, **kwargs)

#     def partial_update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         if instance.doctor != request.user:
#             raise PermissionDenied("You can only partially update your own profile.")
#         return super().partial_update(request, *args, **kwargs)

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         if instance.doctor != request.user:
#             raise PermissionDenied("You can only delete your own profile.")
#         return super().destroy(request, *args, **kwargs)

#     def put(self, request, *args, **kwargs):
#         # Optional: you can explicitly define this, but it's not necessary
#         return self.update(request, *args, **kwargs)

# @api_view(['GET', 'PUT'])
# @permission_classes([permissions.IsAuthenticated])
# def doctor_profile_me(request):
#     user = request.user
#     if user.role != 'doctor':
#         return Response({"error": "Only doctors can access this endpoint."}, status=status.HTTP_403_FORBIDDEN)
    
#     try:
#         profile = DoctorProfile.objects.get(doctor=user)
#     except DoctorProfile.DoesNotExist:
#         return Response({"error": "Doctor profile not found."}, status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = DoctorProfileSerializer(profile)
#         return Response(serializer.data)
    
#     elif request.method == 'PUT':
#         serializer = DoctorProfileSerializer(profile, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




import json
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import DoctorProfile
from .serializers import DoctorProfileSerializer, UserSerializer

class DoctorProfileViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if self.kwargs.get('pk') == 'me':
            if self.request.user.role != 'doctor':
                raise PermissionDenied("Only doctors can access doctor profiles.")
            try:
                return DoctorProfile.objects.get(doctor=self.request.user)
            except DoctorProfile.DoesNotExist:
                raise NotFound("Doctor profile not found.")
        return super().get_object()

    def list(self, request, *args, **kwargs):
        if not request.user.is_staff:
            try:
                instance = DoctorProfile.objects.get(doctor=request.user)
                serializer = self.get_serializer(instance)
                return Response([serializer.data])
            except DoctorProfile.DoesNotExist:
                return Response([], status=status.HTTP_200_OK)
        return super().list(request, *args, **kwargs)

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
        print("Raw available_days:", doctor_data['available_days'])  # Debug
        if isinstance(doctor_data.get('available_days'), str):
            try:
                doctor_data['available_days'] = json.loads(doctor_data['available_days'])
                print("Parsed available_days:", doctor_data['available_days'])  # Debug
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
        print("Serializer errors:", serializer.errors)  # Debug
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.doctor != request.user and not request.user.is_staff:
            raise PermissionDenied("You can only delete your own profile.")
        return super().destroy(request, *args, **kwargs)