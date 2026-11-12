from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password


# People can only pick these roles when they sign up themselves.
# Teachers and admins are created by an admin.
SIGNUP_ROLES = ['student', 'parent']


def check_starts_with_capital(value, field_label):
    if value[0] == value[0].lower():
        raise serializers.ValidationError(field_label + " must start with a capital letter.")


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'confirm_password', 'role', 'phone_number', 'nationality']

    def validate_role(self, value):
        if value not in SIGNUP_ROLES:
            raise serializers.ValidationError("You can only sign up as a student or a parent.")
        return value

    def validate(self, attrs):
        password = attrs.get("password")
        confirm_password = attrs.get("confirm_password")

        check_starts_with_capital(attrs.get("first_name"), "First name")
        check_starts_with_capital(attrs.get("last_name"), "Last name")

        if confirm_password != password:
            raise serializers.ValidationError("Passwords do not match.")

        validate_password(password)

        return attrs

    def create(self, validated_data):
        user = User(
            first_name=validated_data.get("first_name"),
            last_name=validated_data.get("last_name"),
            email=validated_data.get("email"),
            role=validated_data.get("role", "student"),
            phone_number=validated_data.get("phone_number"),
            nationality=validated_data.get("nationality", ""),
        )
        user.set_password(validated_data.get("password"))
        user.save()

        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'nationality', 'created_at']
        # Users can't change their own email or role from the profile page
        read_only_fields = ['id', 'email', 'role', 'created_at']

    def validate_first_name(self, value):
        check_starts_with_capital(value, "First name")
        return value

    def validate_last_name(self, value):
        check_starts_with_capital(value, "Last name")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        validate_password(attrs["new_password"])
        return attrs
