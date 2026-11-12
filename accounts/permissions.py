from rest_framework.permissions import BasePermission


def has_role(user, role):
    return user.is_authenticated and user.role == role


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return has_role(request.user, 'admin')


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return has_role(request.user, 'teacher')


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return has_role(request.user, 'student')


class IsParent(BasePermission):
    def has_permission(self, request, view):
        return has_role(request.user, 'parent')
