from django.db import models
from . import User
import uuid

class Vacation(models.Model):
    """
    VACATION MODEL FOR STORING EMPLOYEES VACATIONS
    """

    VACATION_STATUS_CHOICES = (
        ('PENDING', 'PENDING'),
        ('CONFIRMED', 'CONFIRMED'),
        ('REJECTED', 'REJECTED'),
    )
    VACATION_TYPES_CHOICES = (
        ('ANNUAL', 'Urlop wypoczynkowy'),
        ('ON_DEMAND', 'Urlop na żądanie'),
        ('MATERNITY', 'Urlop macierzyński'), 
        ('PATERNITY', 'Urlop ojcowski'),
        ('PARENTAL', 'Urlop rodzicielski'),
        ('CHILDCARE', 'Urlop wychowawczy'),
        ('UNPAID', 'Urlop bezpłatny'),
        ('SPECIAL', 'Urlop okolicznościowy'),
        ('TRAINING', 'Urlop szkoleniowy'),
        ('HEALTH', 'Urlop zdrowotny')
    )

    vacation_id = models.AutoField(primary_key=True)
    assigned_user = models.ForeignKey(User, on_delete=models.CASCADE)                       # user_id
    vacation_date = models.DateField()
    duration = models.DecimalField(max_digits=4, decimal_places=1, default=8)
    status = models.CharField(
        max_length=20,
        choices=VACATION_STATUS_CHOICES,
        default='PENDING'
    )
    type = models.CharField(
        max_length=20,
        choices=VACATION_TYPES_CHOICES,
        default='UNPAID'
    )
    comments = models.TextField(blank=True, null=True)

    vacation_group_id = models.UUIDField(default=uuid.uuid4, editable=False, db_index=True)

    def __str__(self):
        return f"Vacation for {self.assigned_user.username}. Date: {self.vacation_date}, Duration: {self.duration}h"
    