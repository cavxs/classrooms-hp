from django.urls.conf import path, include
from rest_framework import routers
from .viewsets import CustomTokenObtainPairView,  AuthViewSet, UserInfoViewSet, ClassroomsViewSet, ExamsViewset#,AnswersViewSet
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)

router = routers.DefaultRouter()
router.register("auth", AuthViewSet, basename="registration")
router.register("users", UserInfoViewSet, basename="userinfo")
router.register("classrooms", ClassroomsViewSet, basename="classrooms")
router.register("exams", ExamsViewset, basename="exams")
# router.register("answers", AnswersViewSet, basename="answers")

urlpatterns = [
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("", include(router.urls)),
]