from django.urls.conf import path, include
from rest_framework import routers
from .viewsets import AuthViewSet, UserInfoViewSet, ClassroomsViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register("auth", AuthViewSet, basename="registration")
router.register("users", UserInfoViewSet, basename="userinfo")
router.register("classrooms", ClassroomsViewSet, basename="classrooms")

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("", include(router.urls)),
]