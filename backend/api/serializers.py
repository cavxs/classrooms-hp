from rest_framework import serializers
from .models import User, Classroom

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
    class Meta:
        model = Classroom
        fields = ['name']