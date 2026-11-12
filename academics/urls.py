from django.urls import path
from academics import views


urlpatterns = [
    path("classes/", views.list_classes, name="list_classes"),
    path("classes/<int:class_id>/results/", views.class_results, name="class_results"),
    path("subjects/", views.list_subjects, name="list_subjects"),
    path("results/", views.create_result, name="create_result"),
    path("results/<int:result_id>/", views.update_result, name="update_result"),
    path("results/me/", views.my_results, name="my_results"),
    path("children/", views.my_children, name="my_children"),
    path("results/child/<int:student_id>/", views.child_results, name="child_results"),
]
