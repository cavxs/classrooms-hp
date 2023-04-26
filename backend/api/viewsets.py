from rest_framework.viewsets import ViewSet, ModelViewSet
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .serializers import RegistrationSerializer, UserInfoSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import User, Classroom, Exam
from .serializers import ClassroomsSerializer, ExamsSerializer, ClassroomListSerializer

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
    

class ClassroomsViewSet(ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomsSerializer
    list_serializer_class = ClassroomListSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return self.list_serializer_class
        else:
            return self.serializer_class

    def get_queryset(self):
        return Classroom.objects.filter(Q(teacher=self.request.user) | Q(students=self.request.user))

    def retrieve(self, req, pk=None):
        queryset = self.get_queryset()
        classroom = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(classroom)
        return Response(serializer.data)

    def list(self, req):
        # get only the classrooms the user is in
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def create(self, req):
        serializer = ClassroomsSerializer(data=req.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(teacher=req.user)
        return Response(serializer.data,status=201)
    
    @action(detail=False, methods=['post'])
    def join(self, req):
        code = req.data.get('code')
        # classroom = None
        try:
            classroom = Classroom.objects.get(code=code)
        except:
            return Response("Could not join class", status=404)
        
        classroom.students.add(req.user)
        serializer = ClassroomsSerializer(classroom)
        return Response(serializer.data, status=201)

        

class ExamsViewset(ViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamsSerializer

    def list(self, req):
        queryset = Exam.objects.all()
        serializer = ExamsSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, req):
        serializer = ExamsSerializer(data=req.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(teacher=req.user)
        return Response(serializer.data,status=201)