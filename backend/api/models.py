from django.db import models
from django.contrib.auth.models import AbstractUser

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