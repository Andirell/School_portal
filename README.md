# School Portal

A school management system: a Django REST API (in the project root) and a React + TypeScript frontend (in `frontend/`). It has accounts for admins, teachers, students and parents, classes and subjects, term results, and school news and events.

## Backend setup

```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Admins set up classes, subjects and student profiles (including linking parents to their children) in the Django admin at `/admin/`.

While developing, password reset emails are printed in the terminal. The link in the email points at the frontend, which is `http://localhost:5173` by default. If the frontend runs somewhere else, set the `FRONTEND_URL` environment variable (this also controls CORS).

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL points at the Django server
npm run dev
```

Then open http://localhost:5173.

| Page            | Who      | What it does                                          |
|-----------------|----------|-------------------------------------------------------|
| `/`             | anyone   | Home page with latest news & events                   |
| `/news`         | anyone   | All news and events                                   |
| `/signin`, `/signup`, `/forgot-password`, `/reset-password` | anyone | Accounts |
| `/profile`      | logged in| View and edit your details, delete your account       |
| `/student`      | student  | Your results by term with averages                    |
| `/parent`       | parent   | Your children's results                               |
| `/teacher`      | teacher  | Add and edit results for your class                   |
| `/admin-panel`  | admin    | Manage news posts and view any class's results        |

Other frontend commands: `npm run build` (type check and build) and `npm run lint`.

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
| GET         | `/academics/my-classes/`                        | teacher               |
| GET         | `/academics/classes/<id>/students/`             | class teacher / admin |
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
| GET                  | `/news/all/` (drafts too) | admin |
| POST                 | `/news/`                | admin  |
| PUT / PATCH / DELETE | `/news/<id>/edit/`      | admin  |

## Tests

```bash
python manage.py test
```
