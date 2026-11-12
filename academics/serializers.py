import re

from rest_framework import serializers
from .models import Result, SchoolClass, StudentProfile, Subject


class SchoolClassSerializer(serializers.ModelSerializer):
    class_teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = SchoolClass
        fields = ['id', 'name', 'arm', 'class_teacher', 'class_teacher_name']

    def get_class_teacher_name(self, obj):
        if obj.class_teacher is None:
            return None
        return obj.class_teacher.first_name + " " + obj.class_teacher.last_name


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code']


class StudentSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    school_class = serializers.StringRelatedField()

    class Meta:
        model = StudentProfile
        fields = ['id', 'first_name', 'last_name', 'school_class']


class ResultSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    student_name = serializers.CharField(source='student.__str__', read_only=True)
    total = serializers.IntegerField(read_only=True)
    grade = serializers.CharField(read_only=True)

    class Meta:
        model = Result
        fields = [
            'id', 'student', 'student_name', 'subject', 'subject_name', 'session', 'term',
            'test_score', 'exam_score', 'total', 'grade', 'recorded_by', 'updated_at',
        ]
        read_only_fields = ['recorded_by']

    def validate_session(self, value):
        # Sessions look like "2025/2026"
        if not re.fullmatch(r'\d{4}/\d{4}', value):
            raise serializers.ValidationError("Session must look like 2025/2026.")

        start_year = int(value[:4])
        end_year = int(value[5:])
        if end_year != start_year + 1:
            raise serializers.ValidationError("The second year must come right after the first.")
        return value
