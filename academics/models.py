from django.conf import settings
from django.core.validators import MaxValueValidator
from django.db import models


class SchoolClass(models.Model):
    name = models.CharField(max_length=30)  # e.g. "JSS 1"
    arm = models.CharField(max_length=10, blank=True)  # e.g. "A"
    class_teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='classes_taught',
        limit_choices_to={'role': 'teacher'},
    )

    class Meta:
        unique_together = ('name', 'arm')
        ordering = ['name', 'arm']
        verbose_name_plural = 'school classes'

    def __str__(self):
        if self.arm:
            return self.name + " " + self.arm
        return self.name


class Subject(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class StudentProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile',
        limit_choices_to={'role': 'student'},
    )
    # PROTECT so a class can't be deleted while students are still in it
    school_class = models.ForeignKey(SchoolClass, on_delete=models.PROTECT, related_name='students')
    parents = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name='children',
        limit_choices_to={'role': 'parent'},
    )

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name


class Result(models.Model):
    TERM_CHOICES = (
        ('first', 'First Term'),
        ('second', 'Second Term'),
        ('third', 'Third Term'),
    )

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='results')
    subject = models.ForeignKey(Subject, on_delete=models.PROTECT, related_name='results')
    session = models.CharField(max_length=9)  # e.g. "2025/2026"
    term = models.CharField(max_length=10, choices=TERM_CHOICES)
    test_score = models.PositiveIntegerField(validators=[MaxValueValidator(40)])
    exam_score = models.PositiveIntegerField(validators=[MaxValueValidator(60)])
    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='results_recorded',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # A student only gets one score per subject each term
        unique_together = ('student', 'subject', 'session', 'term')
        ordering = ['session', 'term', 'subject__name']

    def __str__(self):
        return str(self.student) + " - " + str(self.subject) + " (" + self.term + " " + self.session + ")"

    def total(self):
        return self.test_score + self.exam_score

    def grade(self):
        total = self.total()
        if total >= 70:
            return 'A'
        if total >= 60:
            return 'B'
        if total >= 50:
            return 'C'
        if total >= 45:
            return 'D'
        if total >= 40:
            return 'E'
        return 'F'
