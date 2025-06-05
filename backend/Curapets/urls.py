from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
    openapi.Info(
        title="Curapets API",
        default_version='v1',
        description="API documentation for the Curapets Backend System",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="ezekieleyitayo2020@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('admin/', admin.site.urls),
    path('api/user/', include('user.urls')),
    path('api/', include('doctor.urls')),
    path('api/', include('appointments.urls')), 
    path('api/', include('pets.urls')),     

    # Swagger & Redoc URLs
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
