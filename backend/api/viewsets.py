from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from .serializers import RegistrationSerializer, UserInfoSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import User, Classroom
from .serializers import ClassroomsSerializer

class AuthViewSet(ViewSet):
    @action(detail=False, methods=['post'])
    def register(self, req):
        serializer = RegistrationSerializer(data=req.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })
    
class UserInfoViewSet(ViewSet):
    # @action(detail=True, methods=['get'])
    def retrieve(self, req, pk=None):
        user =  get_object_or_404(User, pk=pk)
        serializer = UserInfoSerializer(user)
        return Response(serializer.data)
    

class ClassroomsViewSet(ViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomsSerializer

    def list(self, req):
        queryset = Classroom.objects.all()
        serializer = ClassroomsSerializer(queryset, many=True)
        return Response(serializer.data)


    def create(self, req):
        serializer = ClassroomsSerializer(data=req.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(teacher=req.user)
        return Response(serializer.data,status=201)
        
