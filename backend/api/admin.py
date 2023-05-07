from django.contrib import admin

from .models import User, Exam, ExamTemplate, Question, Classroom, Answers

# Register your models here.

admin.site.register(User)
admin.site.register(Exam)
admin.site.register(Question)
admin.site.register(Classroom)
admin.site.register(ExamTemplate)
admin.site.register(Answers)