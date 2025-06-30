from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from .models import Appointment
from .serializers import AppointmentSerializer
from django.utils import timezone
from datetime import date
from utils.auth import get_safe_user

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = get_safe_user(self)
        if not user:
            return Appointment.objects.none()
        
        if user.role == 'doctor':
            return Appointment.objects.filter(doctor=user)
        return Appointment.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.status != 'pending':
            raise PermissionDenied("Only pending appointments can be modified.")

        if request.user != instance.user and request.user != instance.doctor:
            raise PermissionDenied("You do not have permission to modify this appointment.")

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.status != 'pending':
            return Response(
                {"detail": "Only pending appointments can be deleted."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming(self, request):
        """Get upcoming accepted appointments for the user."""
        user = request.user
        today = date.today()
        queryset = Appointment.objects.filter(
            user=user,
            status='accepted',
            date__gte=today
        ).order_by('date', 'time')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='today')
    def today(self, request):
        """Get today's accepted appointments for the doctor."""
        user = request.user
        if user.role != 'doctor':
            raise PermissionDenied("Only doctors can view today's appointments.")
        today = date.today()
        queryset = Appointment.objects.filter(
            doctor=user,
            status='accepted',
            date=today
        ).order_by('time')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='requests')
    def requests(self, request):
        """Get pending appointment requests for the doctor."""
        user = request.user
        if user.role != 'doctor':
            raise PermissionDenied("Only doctors can view appointment requests.")
        queryset = Appointment.objects.filter(
            doctor=user,
            status='pending'
        ).order_by('date', 'time')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)