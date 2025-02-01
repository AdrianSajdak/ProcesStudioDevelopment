from django.db import models
from . import Project

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
