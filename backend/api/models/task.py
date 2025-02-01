from django.db import models
from django.conf import settings
from . import Project, User
from django.utils import timezone

class Task(models.Model):
    """
    TASK MODEL FOR ASSIGNING TASKS TO EMPLOYEES
    """
    TASK_STATUS_CHOICES = (
        ('OPEN', 'OPEN'),
        ('SUSPENDED', 'SUSPENDED'),
        ('CLOSED', 'CLOSED'),
    )

    task_id = models.AutoField(primary_key=True)
    assigned_project = models.ForeignKey(Project, on_delete=models.CASCADE)                 # project_id
    assigned_user = models.ForeignKey(User, on_delete=models.CASCADE)                       # user_id
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    total_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    status = models.CharField(
        max_length=20, 
        choices=TASK_STATUS_CHOICES,
        default='OPEN'
    )
    created_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(blank=True, null=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='authored_tasks'
    )

    def __str__(self):
        return f"Task #{self.task_id} - {self.name}"

    def save(self, *args, **kwargs):
        """
        END_DATE LOGIC
        """
        if self.status == 'CLOSED' and self.end_date is None:
            self.end_date = timezone.now()
        elif self.status in ['OPEN', 'SUSPENDED']:
            self.end_date = None

        super().save(*args, **kwargs)