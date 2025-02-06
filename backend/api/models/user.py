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
    GENDER_CHOICES = (
        ('M', 'Mężczyzna'),
        ('F', 'Kobieta'),
        ('I', 'Inna'),
    )
    
    CONTRACT_TYPES = (
        ('EMPLOYMENT', 'Umowa o pracę'),
        ('CONTRACT', 'Umowa zlecenie'),
        ('MANDATE', 'Umowa o dzieło'),
        ('B2B', 'Umowa B2B'),
    )

    user_id = models.AutoField(primary_key=True)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='Employee'
    )
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    pesel = models.CharField(max_length=11, blank=True, null=True, unique=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)

    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )

    # Dane kontaktowe
    residential_address = models.TextField(blank=True, null=True)
    mailing_address = models.TextField(blank=True, null=True)
    work_phone = models.CharField(max_length=20, blank=True, null=True)
    private_phone = models.CharField(max_length=20, blank=True, null=True)
    # Dane pracownicze
    employment_date = models.DateField(blank=True, null=True)
    contract_type = models.CharField(
        max_length=20,
        choices=CONTRACT_TYPES,
        default='EMPLOYMENT'
    )
    contract_file = models.FileField(upload_to='contracts/', blank=True, null=True)
    work_percentage = models.PositiveIntegerField(
        blank=True, 
        null=True,
        help_text="Wymiar etatu (w %)"
    )
    position = models.CharField(max_length=100, blank=True, null=True)
    salary_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    bank_account = models.CharField(max_length=26, blank=True, null=True)
    
    REQUIRED_FIELDS = ['email', 'role']
    USERNAME_FIELD = 'username'

    def __str__(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name} ({self.username})"
        return f"{self.username}"