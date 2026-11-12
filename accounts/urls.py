from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts import views


urlpatterns = [
    path("signup/", views.sign_up, name="signup"),
    path("signin/", views.sign_in, name="signin"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", views.get_me, name="me"),
    path("me/update/", views.update_profile, name="update_profile"),
    path("me/delete/", views.delete_profile, name="delete_profile"),
    path("signout/", views.sign_out, name="signout"),
    path("password-reset/", views.password_reset, name="password_reset"),
    path("password-reset/confirm/", views.password_reset_confirm, name="password_reset_confirm"),
]
