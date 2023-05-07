from rest_framework import serializers
from .models import User, Classroom, Exam, ExamTemplate, Answers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class RegistrationSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password2 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'password', 'password2']
        extra_kwargs = {"password": {"write_only": True}}
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Password and password2 should match.")
        
        return data

    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'], first_name=validated_data['first_name'], last_name=validated_data["last_name"])
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']

class ClassroomsSerializer(serializers.ModelSerializer):
    teacher_firstname = serializers.SerializerMethodField() 
    exam_name = serializers.SerializerMethodField()
    students = serializers.SerializerMethodField()

    class Meta:
        model = Classroom
        fields = ['id', 'name', 'teacher', 'teacher_firstname', 'students', 'exam', 'exam_name']
        extra_kwargs = {"teacher":{"read_only":True}}

    def get_teacher_firstname(self, obj):
        return obj.teacher.first_name
    
    def get_exam_name(self, obj):
        if obj.exam:
            return obj.exam.name
    
    def get_students(self, obj):
        return [{'id': s.id, 'first_name': s.first_name, 'last_name': s.last_name} for s in obj.students.all()]

    def to_representation(self, obj):
        data = super().to_representation(obj)

        req = self.context.get('request')
        if req:
            is_owner = req.user == obj.teacher

            if is_owner:
                data['code'] = obj.code
                data['is_owner'] = True
            
        if self.context.get('taken_already'):
            data['taken'] = True

        return data

class ClassroomListSerializer(serializers.ModelSerializer):
    teacher_firstname = serializers.SerializerMethodField()
    class Meta:
        model=Classroom
        fields = ['id', 'name', 'teacher_firstname', 'students']

    def get_teacher_firstname(self, obj):
        return obj.teacher.first_name

    def to_representation(self, obj):
        data = super().to_representation(obj)

        req = self.context.get('request')
        is_owner = req.user == obj.teacher

        if is_owner:
            data['is_owner'] = True
        
        return data


class ExamsTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamTemplate
        fields = ['id', 'name', 'teacher', 'questions']
        extra_kwargs = {"teacher": {"read_only": True}}
    #TODO: validation


class ExamsTemplateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'name', 'teacher']

class ExamsSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    class Meta:
        model= Exam
        fields = ['id', 'name', 'teacher', 'teacher_name', 'classroom', 'questions']
        extra_kwargs = {"id": {"read_only": True}, 'name': {"read_only": True}, 'teacher': {"read_only": True}, 'questions': {"read_only": True}}
    def get_teacher_name(self, obj):
        return obj.teacher.first_name

    def to_representation(self, obj):
        data = super().to_representation(obj)
        if not self.context.get('send_questions'):
            del data['questions']
        
        print(self.context.get('taken_already'))
        if self.context.get('taken_already'):
            data['taken'] = True
         
        return data

class AnswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answers
        fields = ['data', 'grading']
    

class AnswersTakerSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id', 'first_name', 'last_name']

class AnswersDetailedSerializer(serializers.ModelSerializer):
    taker = AnswersTakerSerializer()
    class Meta:
        model = Answers
        fields = ['data', 'grading', 'taker']

class ExamsPageSerializer(serializers.Serializer):
    exams_made = serializers.JSONField()
    exams_given = serializers.JSONField()
    exams_past = serializers.JSONField()
    exams_current = serializers.JSONField()



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # print("what")
        return token
    



    
class CustommRefreshToken(RefreshToken):
    @classmethod
    def create_token(cls, user):
        token = super().create_token(user)
        token['username'] = user.username

        print(token)
        return token