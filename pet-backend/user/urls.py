from django.urls import path
# from .views import SignUpView, MyTokenObtainPairView
from .views import SignUpView, CustomTokenObtainPairView #PasswordResetConfirmView, PasswordResetRequestView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import get_current_user

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("me/", get_current_user, name="current-user"),
    # path('password/reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    # path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
