from django.db import models

class Client(models.Model):
    """
    CLIENT MODEL FOR STORING CLIENTS DATA
    """
    client_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    nip = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100)
    postcode = models.CharField(max_length=20)
    street = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.EmailField()

    def __str__(self):
        return self.name