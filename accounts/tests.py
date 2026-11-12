import re

from django.core import mail
from django.core.cache import cache
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


PASSWORD = 'Str0ngPass!word'


def make_user(email='ada@example.com', role='student'):
    return User.objects.create_user(
        email=email, first_name='Ada', last_name='Obi', password=PASSWORD, role=role,
    )


class SignUpTests(APITestCase):
    def signup_data(self, **changes):
        data = {
            'email': 'new@example.com',
            'first_name': 'Tolu',
            'last_name': 'Bello',
            'password': PASSWORD,
            'confirm_password': PASSWORD,
            'role': 'parent',
            'phone_number': '08012345678',
            'nationality': 'Nigerian',
        }
        data.update(changes)
        return data

    def test_sign_up_saves_all_fields(self):
        response = self.client.post('/accounts/signup/', self.signup_data())
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(email='new@example.com')
        self.assertEqual(user.role, 'parent')
        self.assertEqual(user.phone_number, '08012345678')
        self.assertEqual(user.nationality, 'Nigerian')
        self.assertTrue(user.check_password(PASSWORD))

    def test_cannot_sign_up_as_admin(self):
        response = self.client.post('/accounts/signup/', self.signup_data(role='admin'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email='new@example.com').exists())

    def test_name_must_start_with_capital(self):
        response = self.client.post('/accounts/signup/', self.signup_data(first_name='tolu'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_passwords_must_match(self):
        response = self.client.post('/accounts/signup/', self.signup_data(confirm_password='Different1!'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class SignInAndProfileTests(APITestCase):
    def setUp(self):
        cache.clear()  # reset throttle counters between tests
        self.user = make_user()

    def sign_in(self):
        response = self.client.post('/accounts/signin/', {'email': self.user.email, 'password': PASSWORD})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data

    def test_sign_in_returns_tokens(self):
        tokens = self.sign_in()
        self.assertIn('access_token', tokens)
        self.assertIn('refresh', tokens)

    def test_wrong_password_is_rejected(self):
        response = self.client.post('/accounts/signin/', {'email': self.user.email, 'password': 'wrong'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_needs_login(self):
        response = self.client.get('/accounts/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_and_update_profile(self):
        tokens = self.sign_in()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + tokens['access_token'])

        response = self.client.get('/accounts/me/')
        self.assertEqual(response.data['email'], self.user.email)
        self.assertNotIn('password', response.data)

        response = self.client.patch('/accounts/me/update/', {'nationality': 'Ghanaian', 'role': 'admin'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.nationality, 'Ghanaian')
        # role is read only, so it should not have changed
        self.assertEqual(self.user.role, 'student')

    def test_sign_out_blacklists_refresh_token(self):
        tokens = self.sign_in()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + tokens['access_token'])

        response = self.client.post('/accounts/signout/', {'refresh': tokens['refresh']})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post('/accounts/token/refresh/', {'refresh': tokens['refresh']})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cannot_sign_out_someone_else(self):
        other = make_user(email='other@example.com')
        other_tokens = self.client.post('/accounts/signin/', {'email': other.email, 'password': PASSWORD}).data

        tokens = self.sign_in()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + tokens['access_token'])
        response = self.client.post('/accounts/signout/', {'refresh': other_tokens['refresh']})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_profile(self):
        tokens = self.sign_in()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + tokens['access_token'])

        response = self.client.delete('/accounts/me/delete/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(User.objects.filter(id=self.user.id).exists())


class PasswordResetTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = make_user()

    def test_reset_flow(self):
        response = self.client.post('/accounts/password-reset/', {'email': self.user.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)

        email_body = mail.outbox[0].body
        uid = re.search(r'uid: (\S+)', email_body).group(1)
        token = re.search(r'token: (\S+)', email_body).group(1)

        new_password = 'An0ther!Password'
        data = {'uid': uid, 'token': token, 'new_password': new_password, 'confirm_password': new_password}
        response = self.client.post('/accounts/password-reset/confirm/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(new_password))

        # The same link should not work a second time
        response = self.client.post('/accounts/password-reset/confirm/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unknown_email_gets_same_answer(self):
        known = self.client.post('/accounts/password-reset/', {'email': self.user.email})
        unknown = self.client.post('/accounts/password-reset/', {'email': 'nobody@example.com'})

        self.assertEqual(unknown.status_code, status.HTTP_200_OK)
        self.assertEqual(known.data, unknown.data)
        self.assertEqual(len(mail.outbox), 1)

    def test_bad_token_is_rejected(self):
        data = {'uid': 'abc', 'token': 'nope', 'new_password': 'An0ther!Password', 'confirm_password': 'An0ther!Password'}
        response = self.client.post('/accounts/password-reset/confirm/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
