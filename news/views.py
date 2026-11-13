from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.permissions import IsAdminRole
from .models import Post
from .serializers import PostSerializer


def user_is_admin(user):
    return user.is_authenticated and user.role == 'admin'


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def posts(request):
    if request.method == 'POST':
        # Anyone can read the news, but only admins can post
        if not user_is_admin(request.user):
            return Response({"error": "Only admins can create posts"}, status=status.HTTP_403_FORBIDDEN)

        serializer = PostSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    all_posts = Post.objects.filter(is_published=True)
    category = request.query_params.get('category')
    if category:
        all_posts = all_posts.filter(category=category)

    serializer = PostSerializer(all_posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminRole])
def all_posts(request):
    # Admins need to see drafts too so they can publish them
    serializer = PostSerializer(Post.objects.all(), many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def post_detail(request, post_id):
    post = get_object_or_404(Post, id=post_id, is_published=True)
    serializer = PostSerializer(post)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminRole])
def edit_post(request, post_id):
    # Admins can also edit drafts, so we don't filter by is_published here
    post = get_object_or_404(Post, id=post_id)

    if request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    is_partial = request.method == 'PATCH'
    serializer = PostSerializer(post, data=request.data, partial=is_partial)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    return Response(serializer.data)
