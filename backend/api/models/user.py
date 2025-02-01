from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    USER MODEL FOR AUTHENTICATION AND PERMISSION MANAGEMENT
    """
    ROLE_CHOICES = (
        ('Boss', 'Boss'),
        ('Employee', 'Employee'),
    )
    user_id = models.AutoField(primary_key=True)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='Employee'
    )
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )
    REQUIRED_FIELDS = ['email', 'role']
    USERNAME_FIELD = 'username'

    def __str__(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name} ({self.username})"
        return f"{self.username}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)