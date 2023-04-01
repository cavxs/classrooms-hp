from django.contrib import admin

from .models import User, Exam, Question, Classroom

# Register your models here.

admin.site.register(User)
admin.site.register(Exam)
admin.site.register(Question)
admin.site.register(Classroom)