from datetime import date

from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import Post


def make_user(email, role):
    return User.objects.create_user(
        email=email, first_name='Test', last_name='User', password='Str0ngPass!word', role=role,
    )


class NewsTests(APITestCase):
    def setUp(self):
        self.admin = make_user('admin@example.com', 'admin')
        self.teacher = make_user('teacher@example.com', 'teacher')
        Post.objects.create(title='Cultural Day', body='Come along', is_published=True)
        Post.objects.create(title='Draft post', body='Not ready', is_published=False)

    def test_public_list_shows_only_published(self):
        response = self.client.get('/news/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Cultural Day')

    def test_draft_detail_is_hidden(self):
        draft = Post.objects.get(title='Draft post')
        response = self.client.get('/news/' + str(draft.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_admin_cannot_post(self):
        self.client.force_authenticate(self.teacher)
        response = self.client.post('/news/', {'title': 'Hi', 'body': 'Hello'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_post(self):
        self.client.force_authenticate(self.admin)
        data = {'title': 'Prize Giving Day', 'body': 'Join us', 'category': 'event',
                'event_date': date(2026, 12, 5), 'is_published': True}
        response = self.client.post('/news/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['created_by'], self.admin.id)

    def test_event_needs_a_date(self):
        self.client.force_authenticate(self.admin)
        response = self.client.post('/news/', {'title': 'Sports Day', 'body': 'Run', 'category': 'event'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_only_admin_can_edit(self):
        post = Post.objects.get(title='Cultural Day')

        self.client.force_authenticate(self.teacher)
        response = self.client.delete('/news/' + str(post.id) + '/edit/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(self.admin)
        response = self.client.patch('/news/' + str(post.id) + '/edit/', {'title': 'Cultural Day 2026'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
