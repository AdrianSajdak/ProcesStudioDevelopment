from django.db import models

# class User(models.Model):
#     first_name = models.CharField(max_length=50)
#     last_name = models.CharField(max_length=50)
#     email = models.EmailField(unique=True, max_length=100)
#     password = models.CharField(max_length=100)
#     created = models.DateTimeField(auto_now_add=True)

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
    
