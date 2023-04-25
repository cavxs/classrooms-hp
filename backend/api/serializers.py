from rest_framework import serializers
from .models import User, Classroom, Exam

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
    students = serializers.SerializerMethodField()

    class Meta:
        model = Classroom
        fields = ['id', 'name', 'teacher', 'teacher_firstname', 'students']

    def get_teacher_firstname(self, obj):
        return obj.teacher.first_name
    
    def get_students(self, obj):
        return [{'id': s.id, 'first_name': s.first_name, 'last_name': s.last_name} for s in obj.students.all()]


class ExamsSerializer(serializers.ModelSerializer):
    classroom = serializers.CharField(required=False)
    class Meta:
        model = Exam
        fields = ['id', 'name', 'teacher', 'classroom', 'questions']
        extra_kwargs = {"id": {"read_only": True}}
    #TODO: validation