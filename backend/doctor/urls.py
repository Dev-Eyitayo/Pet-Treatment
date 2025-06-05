from rest_framework.routers import DefaultRouter
from .views import DoctorProfileViewSet, DoctorApplicationViewSet

router = DefaultRouter()

router.register('applications', DoctorApplicationViewSet, basename='doctor-application')
router.register(r'doctorprofiles', DoctorProfileViewSet, basename='doctor-profile')

urlpatterns = router.urls
