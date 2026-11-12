from django.conf import settings
from django.db import models


class Post(models.Model):
    CATEGORY_CHOICES = (
        ('news', 'News'),
        ('event', 'Event'),
    )

    title = models.CharField(max_length=200)
    body = models.TextField()
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='news')
    event_date = models.DateField(null=True, blank=True)
    is_published = models.BooleanField(default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
