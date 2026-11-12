from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'body', 'category', 'event_date', 'is_published', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']

    def validate(self, attrs):
        # Work out the category for PATCH requests that don't send it
        category = attrs.get('category')
        if category is None and self.instance is not None:
            category = self.instance.category

        event_date = attrs.get('event_date')
        if event_date is None and self.instance is not None:
            event_date = self.instance.event_date

        if category == 'event' and event_date is None:
            raise serializers.ValidationError("Events need an event date.")
        return attrs
