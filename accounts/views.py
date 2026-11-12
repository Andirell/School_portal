from .models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken


@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Sign up successful"}, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def sign_in(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(email=email, password=password)

    if user is not None:  
        access = AccessToken.for_user(user)
        refresh = RefreshToken.for_user(user)
        return Response({"message": "Sign in successful", "access_token": str(access), "refresh": str(refresh)}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    serializers = UserSerializer(request.user)
    return Response(serializers.data, status=status.HTTP_200_OK)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    pass


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_profile(request):
    user = request.user
    user.delete()
    return Response({"message": "Profile deleted successfully"}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sign_out(request):
    pass 

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": " Email is required'}, status=status.HTTP_400_BAD_REQUEST)"})
    try:
        user.objects.get(email=email)
        return Response({"error": "code has been sent to your email"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)