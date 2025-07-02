from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import DoctorProfileViewSet, DoctorApplicationViewSet, GenerateCloudinarySignatureView

router = DefaultRouter()
router.register(r'applications', DoctorApplicationViewSet, basename='doctor-application')
router.register(r'doctorprofiles', DoctorProfileViewSet, basename='doctor-profile')

urlpatterns = router.urls + [
    path('generate-cloudinary-signature/', GenerateCloudinarySignatureView.as_view(), name='generate-cloudinary-signature'),
]
