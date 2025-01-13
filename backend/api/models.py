from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


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


class Client(models.Model):
    """
    CLIENT MODEL FOR STORING CLIENTS DATA
    """
    client_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    nip = models.CharField(max_length=20, blank=True, null=True, unique=True)
    description = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    postcode = models.CharField(max_length=20, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    """
    PROJECT MODEL FOR STORING PROJECTS DATA
    """
    PROJECT_TYPE_CHOICES = (
        ('MIESZKANIOWY', 'MIESZKANIOWY'),
        ('BLOKOWY', 'BLOKOWY'),
        ('DOM', 'DOM'),
        ('HALA', 'HALA'),
        ('PUBLICZNY', 'PUBLICZNY'),
        ('INNY', 'INNY'),
    )
    PROJECT_STATUS_CHOICES = (
        ('OPEN', 'OPEN'),
        ('SUSPENDED', 'SUSPENDED'),
        ('CLOSED', 'CLOSED'),
    )

    project_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    assigned_client = models.ForeignKey(Client, on_delete=models.CASCADE)  # client_id
    type = models.CharField(
        max_length=50,
        choices=PROJECT_TYPE_CHOICES
    )
    city = models.CharField(max_length=100, blank=True, null=True)
    postcode = models.CharField(max_length=20, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(
        max_length=20, 
        choices=PROJECT_STATUS_CHOICES,
        default='OPEN'
    )
    area = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    comments = models.TextField(blank=True, null=True)

    created_date = models.DateTimeField(auto_now_add=True)    

    def __str__(self):
        return f"Projekt #{self.project_id} - {self.type} (Klient: {self.assigned_client.name})"


class Phase(models.Model):
    """
    PHASE MODEL FOR STORING PROJECT PHASES DATA
    """
    PHASE_TYPE_CHOICES = (
        ('KONSULTACJE', 'KONSULTACJE'),
        ('PLANOWANIE', 'PLANOWANIE'),
        ('POPRAWKI', 'POPRAWKI'),
        ('PODSUMOWANIE', 'PODSUMOWANIE'),
    )
    PHASE_STATUS_CHOICES = (
        ('OPEN', 'OPEN'),
        ('SUSPENDED', 'SUSPENDED'),
        ('CLOSED', 'CLOSED'),
    )

    phase_id = models.AutoField(primary_key=True)
    assigned_project = models.ForeignKey(Project, on_delete=models.CASCADE)                 # project_id
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    type = models.CharField(
        max_length=20,
        choices=PHASE_TYPE_CHOICES
    )
    status = models.CharField(
        max_length=20, 
        choices=PHASE_STATUS_CHOICES,
        default='OPEN'
    )
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Faza: {self.name} (Projekt #{self.assigned_project.name})"


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
        import datetime
        if self.status == 'CLOSED' and self.end_date is None:
            self.end_date = datetime.datetime.now()
        elif self.status in ['OPEN', 'SUSPENDED']:
            self.end_date = None

        super().save(*args, **kwargs)


class Post(models.Model):
    """
    POST MODEL FOR STORING WORK HOURS AND COMMENTS FOR TASKS
    """
    post_id = models.AutoField(primary_key=True)
    assigned_task = models.ForeignKey(Task, on_delete=models.CASCADE)                            # task_id
    post_date = models.DateTimeField()
    work_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Post #{self.post_id} for Task #{self.assigned_task.name}"

    def save(self, *args, **kwargs):
        """
        TOTAL_HOURS AUTO SUM LOGIC
        """
        super().save(*args, **kwargs)

        task = self.assigned_task
        total = Post.objects.filter(assigned_task=task).aggregate(
            models.Sum('work_hours')
        )['work_hours__sum'] or 0.0
        task.total_hours = total
        task.save()

class Vacation(models.Model):
    """
    VACATION MODEL FOR STORING EMPLOYEES VACATIONS
    """

    VACATION_STATUS_CHOICES = (
        ('PENDING', 'PENDING'),
        ('CONFIRMED', 'CONFIRMED'),
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
    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Vacation for {self.assigned_user.username}. Date: {self.vacation_date}, Duration: {self.duration}h"