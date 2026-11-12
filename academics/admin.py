from django.contrib import admin
from .models import Result, SchoolClass, StudentProfile, Subject


@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
    list_display = ['name', 'arm', 'class_teacher']


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'code']
    search_fields = ['name', 'code']


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'school_class']
    list_filter = ['school_class']
    filter_horizontal = ['parents']


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'subject', 'session', 'term', 'test_score', 'exam_score', 'total', 'grade']
    list_filter = ['session', 'term', 'subject']
