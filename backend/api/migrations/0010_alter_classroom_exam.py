# Generated by Django 4.2 on 2023-05-08 11:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_remove_answers_grade_answers_grading'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classroom',
            name='exam',
            field=models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_DEFAULT, related_name='classroom', to='api.exam'),
        ),
    ]
