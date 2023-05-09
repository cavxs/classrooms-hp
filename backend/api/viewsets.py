from rest_framework.viewsets import ViewSet, ModelViewSet
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .serializers import RegistrationSerializer, UserInfoSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import User, Classroom, Exam, ExamTemplate, Answers
from .serializers import CustommRefreshToken, CustomTokenObtainPairSerializer, ClassroomsSerializer, ExamsSerializer, ClassroomListSerializer, ExamsTemplateListSerializer, ExamsTemplateSerializer, AnswersSerializer, ExamsPageSerializer, AnswersDetailedSerializer

class AuthViewSet(ViewSet):
    @action(detail=False, methods=['post'])
    def register(self, req):
        serializer = RegistrationSerializer(data=req.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = CustommRefreshToken.for_user(user)
        
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
        return Classroom.objects.filter(Q(teacher=self.request.user) | Q(students=self.request.user)).distinct()

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        classroom = get_object_or_404(queryset, pk=pk)
        taken_already = False
        if classroom.exam is not None:
            taken_already = Answers.objects.filter(exam=classroom.exam, taker=request.user)
        serializer = self.get_serializer(classroom, context={"request": request, "taken_already": taken_already})
        return Response(serializer.data)

    def list(self, req):
        # get only the classrooms the user is in
        queryset = self.get_queryset()
        print(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(teacher=request.user)
        return Response(serializer.data,status=201)
    
    def destroy(self, request, pk=None):
        classroom = self.get_object()
        if request.user == classroom.teacher:
            return super().destroy(self, request, pk)
        else:
            return Response("You are not the teacher", status=400)

    @action(detail=False, methods=['post'])
    def join(self, request):
        code = request.data.get('code')
        # classroom = None
        try:
            classroom = Classroom.objects.get(code=code)
        except:
            return Response("Could not join class", status=404)
        
        classroom.students.add(request.user)
        classroom.save()
        serializer = self.get_serializer(classroom)
        return Response(serializer.data, status=201)
    
    @action(detail=True, methods=['put'])
    def leave(self, request, pk=None):
        classroom = self.get_object()
        classroom.students.remove(request.user)
        classroom.save()
        serializer = self.get_serializer(classroom)
        return Response(serializer.data, status=200)
    
    @action(detail=True, methods=['put'])
    def assign(self, request, pk=None):
        classroom = self.get_object()
        # check if the user is the teacher of the classroom
        if request.user == classroom.teacher:
            # create a exam from exam template 
            # Exam.objects.create()
            if classroom.exam is not None:
                print("classroom already has an exam")
                # dleete the old exam
                classroom.exam.delete()
            exam_t_id = request.data.get('exam')
            exam_t = ExamTemplate.objects.get(id=exam_t_id)
            exam = Exam(name=exam_t.name, teacher=request.user, questions=exam_t.questions)
            exam.save()
            classroom.exam = exam
            classroom.save()
            serializer = self.get_serializer(classroom)
            return Response(serializer.data, status=200)
        return Response(status=400)
        
    @action(detail=True, methods=['put'])
    def cancel(self, request, pk=None):
        classroom = self.get_object()
        if request.user == classroom.teacher:
            if classroom.exam is not None:
                classroom.exam.delete()
                classroom.exam= None
                classroom.save()
                print(classroom)
                serializer = self.get_serializer(classroom)
                return Response(serializer.data, status=200)
        return Response(status=400)
        
        

class ExamsViewset(ModelViewSet):
    queryset = ExamTemplate.objects.all()
    serializer_class = ExamsTemplateSerializer
    list_serializer_class = ExamsTemplateListSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return self.list_serializer_class
        return self.serializer_class
    
    # def get_queryset(self):
    #     return ExamTemplate.objects.all()
        # return Exam.objects.filter(teacher=self.request.user)

    def list(self, request):
        print()
        if request.query_params.get('templates', False):
            templates = ExamTemplate.objects.filter(teacher=request.user)
            serializer = ExamsTemplateSerializer(templates, many=True)
            return Response(serializer.data, status=200)
        else: 
            exams_made = ExamTemplate.objects.filter(teacher=request.user).values("id", "name", "teacher__first_name")
            exams_given = Exam.objects.filter(teacher=request.user).values("id", "name", "teacher__first_name")
            exams_past = Answers.objects.filter(taker=request.user).values("exam__id", "exam__name", "exam__teacher__first_name", "grading")
            classrooms = request.user.classrooms_joined.all()
            exams_in_my_classrooms = Exam.objects.filter(classroom__in=classrooms)
            print(exams_in_my_classrooms)
            exams_i_didnt_answer = exams_in_my_classrooms.exclude(id__in=Answers.objects.filter(taker=request.user).values_list("exam__id", flat=True)).values("id", "name", "classroom__name", "teacher__first_name")
            print(exams_i_didnt_answer)
            
            data = {"exams_made": list(exams_made),
                    "exams_given": list(exams_given),
                    "exams_past": list(exams_past),
                    "exams_current": list(exams_i_didnt_answer)
                    }

            serializer = ExamsPageSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            return Response(serializer.data, status=200)

    def retrieve(self, request, pk=None):
        exam_template = self.get_object()
        if exam_template.teacher == request.user:
            return super().retrieve(self, request, pk)
        else:
            return Response(status=400)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(teacher=request.user)
        return Response(serializer.data, status=201)
    
    @action(detail=False, methods=['get'], url_path='get/(?P<eid>[^/.]+)')
    def get(self, request, eid=None):
        # print(exam_id)
        exam = Exam.objects.get(pk=eid)
        taken_already = Answers.objects.filter(exam=exam, taker=request.user).exists()
        serializer = ExamsSerializer(exam, context={'send_questions': False, 'taken_already': taken_already})
        return Response(serializer.data, status=200)
    

    @action(detail=False, methods=['get'], url_path='start/(?P<eid>[^/.]+)')
    def start(self, request, eid=None):
        exam = Exam.objects.get(pk=eid)
        taken_already = Answers.objects.filter(exam=exam, taker=request.user).exists()
        if not taken_already:
            serializer = ExamsSerializer(exam, context={'send_questions': True})
            return Response(serializer.data, status=200)
        return Response({"error": "exam taken already"}, status=400)

    @action(detail=False, methods=['post'], url_path='submit/(?P<eid>[^/.]+)')
    def submit_ans(self, request, eid=None):
        exam = Exam.objects.get(pk=eid)
        if not Answers.objects.filter(exam=exam, taker=request.user).exists():
            serializer = AnswersSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(taker=request.user, exam=exam)
            return Response(serializer.data, status=201)
        return Response({"error": "exam taken already"}, status=400)

    @action(detail=False, methods=['get'], url_path='answers/(?P<eid>[^/.]+)')
    def get_answers(self, request,eid=None):
        qs = Answers.objects.get(taker=request.user, exam=eid)
        exam = Exam.objects.get(pk=eid)
        answers_serializer = AnswersSerializer(qs)
        exam_serializer = ExamsSerializer(exam, context={'send_questions': True})
        data = {
            "exam_data": exam_serializer.data,
            "answers": answers_serializer.data
        }
        return Response(data, status=200)
    
    @action(detail=False, methods=['get'], url_path='check/(?P<eid>[^/.]+)')
    def checking(self, request, eid=None):
        exam= Exam.objects.get(pk=eid)
        teacher = exam.teacher
        if request.user == teacher:
            detail = request.query_params.get('rid', None)
            if detail is not None:
                answers = AnswersDetailedSerializer(Answers.objects.get(pk=detail)).data
                exam_serializer = ExamsSerializer(exam, context={"send_questions":True})
                answers['exam'] = exam_serializer.data
            else:
                answers = Answers.objects.filter(exam=eid).values('id','taker__first_name', 'taker__last_name')
            return Response(answers,status=200)
        return Response(status=400)
    
    @action(detail=False, methods=['put'], url_path='grade/(?P<eid>[^/.]+)')
    def grade(self, request, eid=None):
        exam = Exam.objects.get(pk=eid)
        teacher = exam.teacher
        if request.user == teacher:
            q_id = request.data.get('question')
            grading = request.data.get('value')
            taker_id = request.data.get('taker')
            print(taker_id)
            answers = Answers.objects.get(exam=eid, taker=taker_id)
            if answers.grading is None:
                answers.grading = []

            grading_length = len(answers.grading)

            if grading_length > q_id:
                answers.grading[q_id] = grading
            else:
                answers.grading.extend([None] * (q_id - grading_length + 1))
                answers.grading[q_id] = grading
            
            #TODO: initialize the grading value from the models instead

            answers.save()

            return Response(AnswersSerializer(answers).data, status=200)

    
    



# class AnswersViewSet(ModelViewSet):
#     pass
#     serializer_class = AnswersSerializer
#     queryset = Answers.objects.all()

#     def get_queryset(self):
#         return Answers.objects.filter(examself.request.user)

#     def list(self, request):
#         qs = self.get_queryset()
#         serializer = self.get_serializer(qs,many=True)
#         return Response(serializer.data, status = 200)




# class CustomRefreshTokenView(TokenRefreshView):
#     def get_serializer(self, *args, **kwargs):
#         serializer_class = self.get_serializer_class()
#         print('woahofs')
#         print(kwargs)
#         kwargs['refresh_token_serializer'] = CustommRefreshToken

#         return serializer_class(*args, **kwargs)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class=CustomTokenObtainPairSerializer