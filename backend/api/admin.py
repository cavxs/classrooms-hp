from django.contrib import admin

from .models import User, Exam, ExamTemplate, Question, Classroom, Answers



class ExamAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'teacher', 'questions', 'classroom')

# Register your models here.

admin.site.register(User)
admin.site.register(Exam, ExamAdmin)
admin.site.register(Question)
admin.site.register(Classroom)
admin.site.register(ExamTemplate)
admin.site.register(Answers)