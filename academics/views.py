from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsParent, IsStudent, IsTeacher
from .models import Result, SchoolClass, StudentProfile, Subject
from .serializers import ResultSerializer, SchoolClassSerializer, StudentSerializer, SubjectSerializer


def filter_results(results, request):
    # Let people narrow results down with ?session=2025/2026&term=first
    session = request.query_params.get('session')
    term = request.query_params.get('term')

    if session:
        results = results.filter(session=session)
    if term:
        results = results.filter(term=term)

    return results.select_related('subject', 'student__user')


def is_class_teacher_of(teacher, student):
    return student.school_class.class_teacher_id == teacher.id


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_classes(request):
    classes = SchoolClass.objects.select_related('class_teacher')
    serializer = SchoolClassSerializer(classes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_subjects(request):
    serializer = SubjectSerializer(Subject.objects.all(), many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsTeacher])
def create_result(request):
    serializer = ResultSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # Teachers can only add results for students in a class they teach
    student = serializer.validated_data['student']
    if not is_class_teacher_of(request.user, student):
        return Response({"error": "You don't teach this student's class"}, status=status.HTTP_403_FORBIDDEN)

    serializer.save(recorded_by=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsTeacher])
def update_result(request, result_id):
    # Only look through results from the teacher's own classes, so they get a 404 for anyone else's
    result = get_object_or_404(Result, id=result_id, student__school_class__class_teacher=request.user)

    is_partial = request.method == 'PATCH'
    serializer = ResultSerializer(result, data=request.data, partial=is_partial)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # Check again in case the teacher tried to move the result to a student in another class
    student = serializer.validated_data.get('student', result.student)
    if not is_class_teacher_of(request.user, student):
        return Response({"error": "You don't teach this student's class"}, status=status.HTTP_403_FORBIDDEN)

    serializer.save(recorded_by=request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsStudent])
def my_results(request):
    student = get_object_or_404(StudentProfile, user=request.user)
    results = filter_results(student.results.all(), request)
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsParent])
def my_children(request):
    children = StudentProfile.objects.filter(parents=request.user).select_related('user', 'school_class')
    serializer = StudentSerializer(children, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsParent])
def child_results(request, student_id):
    # Filtering by parents means a parent gets a 404 for a child that isn't theirs
    child = get_object_or_404(StudentProfile, id=student_id, parents=request.user)
    results = filter_results(child.results.all(), request)
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def class_results(request, class_id):
    school_class = get_object_or_404(SchoolClass, id=class_id)

    is_admin = request.user.role == 'admin'
    is_this_class_teacher = school_class.class_teacher_id == request.user.id
    if not is_admin and not is_this_class_teacher:
        return Response({"error": "You can't view results for this class"}, status=status.HTTP_403_FORBIDDEN)

    results = filter_results(Result.objects.filter(student__school_class=school_class), request)
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)
