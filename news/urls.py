from django.urls import path
from news import views


urlpatterns = [
    path("", views.posts, name="posts"),
    path("all/", views.all_posts, name="all_posts"),
    path("<int:post_id>/", views.post_detail, name="post_detail"),
    path("<int:post_id>/edit/", views.edit_post, name="edit_post"),
]
