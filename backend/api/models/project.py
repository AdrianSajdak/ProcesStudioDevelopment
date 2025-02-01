from django.db import models
from . import Client

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
