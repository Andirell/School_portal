# School Management API

A Django REST API for running a secondary school: accounts for admins, teachers, students and parents, classes and subjects, term results, and school news and events.

## Setup

```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Admins set up classes, subjects and student profiles (including linking parents to their children) in the Django admin at `/admin/`.

While developing, password reset emails are printed in the terminal.

## Roles

| Role    | How they get an account      | What they can do                                   |
|---------|------------------------------|----------------------------------------------------|
| admin   | `createsuperuser` or admin   | Manage everything, post news, view any class results |
| teacher | Created by an admin          | Add and edit results for the class they teach      |
| student | Sign up                      | View their own results                             |
| parent  | Sign up                      | View their children's results                      |

## Endpoints

Send the access token as `Authorization: Bearer <token>`.

### Accounts
| Method      | URL                                | Who        |
|-------------|------------------------------------|------------|
| POST        | `/accounts/signup/`                | anyone     |
| POST        | `/accounts/signin/`                | anyone     |
| POST        | `/accounts/token/refresh/`         | anyone     |
| GET         | `/accounts/me/`                    | logged in  |
| PUT / PATCH | `/accounts/me/update/`             | logged in  |
| DELETE      | `/accounts/me/delete/`             | logged in  |
| POST        | `/accounts/signout/` (`refresh`)   | logged in  |
| POST        | `/accounts/password-reset/`        | anyone     |
| POST        | `/accounts/password-reset/confirm/`| anyone     |

### Academics
| Method      | URL                                             | Who                   |
|-------------|-------------------------------------------------|-----------------------|
| GET         | `/academics/classes/`                           | logged in             |
| GET         | `/academics/subjects/`                          | logged in             |
| POST        | `/academics/results/`                           | teacher (own class)   |
| PUT / PATCH | `/academics/results/<id>/`                      | teacher (own class)   |
| GET         | `/academics/results/me/?session=&term=`         | student               |
| GET         | `/academics/children/`                          | parent                |
| GET         | `/academics/results/child/<student_id>/`        | parent (own child)    |
| GET         | `/academics/classes/<id>/results/`              | class teacher / admin |

Scores: test out of 40, exam out of 60. Grades: A 70+, B 60+, C 50+, D 45+, E 40+, F below 40.

### News & Events
| Method               | URL                     | Who    |
|----------------------|-------------------------|--------|
| GET                  | `/news/?category=event` | anyone |
| GET                  | `/news/<id>/`           | anyone |
| POST                 | `/news/`                | admin  |
| PUT / PATCH / DELETE | `/news/<id>/edit/`      | admin  |

## Tests

```bash
python manage.py test
```
