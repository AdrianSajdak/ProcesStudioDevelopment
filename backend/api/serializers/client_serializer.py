from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from ..models import Client

class ClientSerializer(serializers.ModelSerializer):
    nip = serializers.CharField(
        required=True,
        allow_blank=False,
        validators=[
            UniqueValidator(
                queryset=Client.objects.all(),
                message="Klient z takim NIP już istnieje."
            )
        ]
    )

    class Meta:
        model = Client
        fields = [
            'client_id', 'name', 'nip', 'description', 'city',
            'postcode', 'street', 'contact_person', 'contact_email'
        ]
        read_only_fields = ['client_id']