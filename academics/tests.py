from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import Result, SchoolClass, StudentProfile, Subject


def make_user(email, role, first_name='Test'):
    return User.objects.create_user(
        email=email, first_name=first_name, last_name='User', password='Str0ngPass!word', role=role,
    )


class ResultTests(APITestCase):
    def setUp(self):
        self.teacher = make_user('teacher@example.com', 'teacher')
        self.other_teacher = make_user('teacher2@example.com', 'teacher')
        self.parent = make_user('parent@example.com', 'parent')
        self.other_parent = make_user('parent2@example.com', 'parent')

        self.jss1 = SchoolClass.objects.create(name='JSS 1', arm='A', class_teacher=self.teacher)
        self.jss2 = SchoolClass.objects.create(name='JSS 2', arm='A', class_teacher=self.other_teacher)
        self.maths = Subject.objects.create(name='Mathematics', code='MTH')

        self.student_user = make_user('student@example.com', 'student')
        self.student = StudentProfile.objects.create(user=self.student_user, school_class=self.jss1)
        self.student.parents.add(self.parent)

        self.other_student_user = make_user('student2@example.com', 'student')
        self.other_student = StudentProfile.objects.create(user=self.other_student_user, school_class=self.jss2)

    def result_data(self, student, **changes):
        data = {
            'student': student.id,
            'subject': self.maths.id,
            'session': '2025/2026',
            'term': 'first',
            'test_score': 30,
            'exam_score': 45,
        }
        data.update(changes)
        return data

    def test_teacher_adds_result_for_own_class(self):
        self.client.force_authenticate(self.teacher)
        response = self.client.post('/academics/results/', self.result_data(self.student))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['total'], 75)
        self.assertEqual(response.data['grade'], 'A')
        self.assertEqual(response.data['recorded_by'], self.teacher.id)

    def test_teacher_cannot_add_result_for_other_class(self):
        self.client.force_authenticate(self.teacher)
        response = self.client.post('/academics/results/', self.result_data(self.other_student))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_add_results(self):
        self.client.force_authenticate(self.student_user)
        response = self.client.post('/academics/results/', self.result_data(self.student))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_scores_over_the_limit_are_rejected(self):
        self.client.force_authenticate(self.teacher)
        response = self.client.post('/academics/results/', self.result_data(self.student, exam_score=70))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bad_session_is_rejected(self):
        self.client.force_authenticate(self.teacher)
        response = self.client.post('/academics/results/', self.result_data(self.student, session='2025/2030'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_teacher_cannot_edit_other_class_result(self):
        result = Result.objects.create(
            student=self.other_student, subject=self.maths, session='2025/2026', term='first',
            test_score=20, exam_score=20,
        )
        self.client.force_authenticate(self.teacher)
        response = self.client.patch('/academics/results/' + str(result.id) + '/', {'exam_score': 60})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_teacher_cannot_move_result_to_other_class(self):
        result = Result.objects.create(
            student=self.student, subject=self.maths, session='2025/2026', term='first',
            test_score=20, exam_score=20,
        )
        self.client.force_authenticate(self.teacher)
        response = self.client.patch('/academics/results/' + str(result.id) + '/', {'student': self.other_student.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_sees_only_own_results(self):
        Result.objects.create(student=self.student, subject=self.maths, session='2025/2026', term='first', test_score=30, exam_score=30)
        Result.objects.create(student=self.other_student, subject=self.maths, session='2025/2026', term='first', test_score=10, exam_score=10)

        self.client.force_authenticate(self.student_user)
        response = self.client.get('/academics/results/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['total'], 60)

    def test_parent_sees_own_child_results(self):
        Result.objects.create(student=self.student, subject=self.maths, session='2025/2026', term='first', test_score=30, exam_score=30)

        self.client.force_authenticate(self.parent)
        response = self.client.get('/academics/results/child/' + str(self.student.id) + '/?term=first')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.client.get('/academics/children/')
        self.assertEqual(len(response.data), 1)

    def test_parent_cannot_see_other_child(self):
        self.client.force_authenticate(self.other_parent)
        response = self.client.get('/academics/results/child/' + str(self.student.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_class_results_only_for_class_teacher(self):
        self.client.force_authenticate(self.other_teacher)
        response = self.client.get('/academics/classes/' + str(self.jss1.id) + '/results/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(self.teacher)
        response = self.client.get('/academics/classes/' + str(self.jss1.id) + '/results/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_teacher_sees_own_classes(self):
        self.client.force_authenticate(self.teacher)
        response = self.client.get('/academics/my-classes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.jss1.id)

    def test_class_students_only_for_class_teacher(self):
        self.client.force_authenticate(self.teacher)
        response = self.client.get('/academics/classes/' + str(self.jss1.id) + '/students/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.student.id)

        response = self.client.get('/academics/classes/' + str(self.jss2.id) + '/students/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_see_any_class_students(self):
        admin = make_user('admin@example.com', 'admin')
        self.client.force_authenticate(admin)
        response = self.client.get('/academics/classes/' + str(self.jss2.id) + '/students/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class GradeTests(APITestCase):
    def test_grades(self):
        expected = [(75, 'A'), (70, 'A'), (65, 'B'), (55, 'C'), (47, 'D'), (42, 'E'), (39, 'F')]
        for total, grade in expected:
            result = Result(test_score=0, exam_score=total)
            self.assertEqual(result.grade(), grade)
