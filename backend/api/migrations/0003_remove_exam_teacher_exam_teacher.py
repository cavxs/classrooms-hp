# Generated by Django 4.2 on 2023-04-24 10:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_classroom_exam'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exam',
            name='teacher',
        ),
        migrations.AddField(
            model_name='exam',
            name='teacher',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='exams', to=settings.AUTH_USER_MODEL),
        ),
    ]