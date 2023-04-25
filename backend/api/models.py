from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models

# Create your models here.

def pkgen():
    from base64 import b32encode
    from hashlib import sha1
    from random import random
    rude = ('lol',)
    bad_pk = True
    while bad_pk:
        pk = b32encode(sha1(str(random()).encode('utf-8')).digest()).lower()[:10].decode("utf-8") 
        bad_pk = False
        for rw in rude:
            if pk.find(rw) >= 0: bad_pk = True
    return pk

class User(AbstractUser):
    pass


class Classroom(models.Model):
    name = models.CharField(max_length=50, blank=False, default="My Classroom")
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="classrooms_created")
    students = models.ManyToManyField(User, blank=False, related_name="classrooms_joined")
    exam = models.ForeignKey("Exam", blank=True, null=True, default=None, on_delete=models.CASCADE, related_name="classroom")
    
    def __str__(self):
        return f"{self.teacher}'s classroom: {self.name}"


class Question(models.Model):
    TEXT_ANSWER = 'ta'
    MULTIPLE_CHOICE = 'mc'
    QUESTION_TYPES = [
        (TEXT_ANSWER, 'Text Answer'),
        (MULTIPLE_CHOICE, 'Multiple Choice'),
    ]
    
    text = models.CharField(max_length=255)
    question_type = models.CharField(max_length=2, choices=QUESTION_TYPES)
    correct_answer = models.CharField(max_length=255)
    wrong_answer_1 = models.CharField(max_length=255, blank=True, null=True)
    wrong_answer_2 = models.CharField(max_length=255, blank=True, null=True)
    wrong_answer_3 = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='question_images', blank=True, null=True)

    def clean(self):
        if self.question_type == self.MULTIPLE_CHOICE and not all([self.correct_answer, self.wrong_answer_1, self.wrong_answer_2, self.wrong_answer_3]):
            raise ValidationError('A multiple choice question must have a correct answer and 3 wrong answers')

    def __str__(self):
        return f"{self.question_type} question: {self.text}" 

class Exam(models.Model):
    id = models.CharField(max_length=10, primary_key=True, default=pkgen)
    name= models.CharField(max_length=30)
    teacher = models.ForeignKey(User, default=None, on_delete=models.CASCADE, related_name='exams')
    questions = models.JSONField()

    def __str__(self) -> str:
        return f"{self.name} exam on {self.classroom.name} by {self.teacher.username}"