from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class Project(models.Model):
    name =models.CharField(unique = True, max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    comments =models.CharField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class User(AbstractUser):
    ROLE_CHOICES = (
        ('Boss', 'Boss'),
        ('Employee', 'Employee'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Employee')
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

class Task(models.Model):
    STATUS_CHOICES = (
        ('Open', 'Open'),
        ('Closed', 'Closed')
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Open')
    work_hours = models.FloatField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    assigned_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks')
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='authored_tasks')

    def __str__(self):
        return self.name