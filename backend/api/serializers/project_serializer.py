from rest_framework import serializers
from ..models import Project, Client
from . import ClientSerializer


class ProjectSerializer(serializers.ModelSerializer):
    assigned_client = ClientSerializer(read_only=True)
    assigned_client_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Project
        fields = [
            'project_id', 'name', 'assigned_client', 'assigned_client_id',
            'type', 'city', 'postcode', 'street',
            'status', 'area', 'comments',
        ]
        read_only_fields = ['project_id']
    
    def create(self, validated_data):
        client_id = validated_data.pop('assigned_client_id')
        client = Client.objects.get(pk=client_id)
        project = Project.objects.create(
            assigned_client=client,
            **validated_data
        )
        return project

    def update(self, instance, validated_data):
        if 'assigned_client_id' in validated_data:
            client_id = validated_data.pop('assigned_client_id')
            instance.assigned_client = Client.objects.get(pk=client_id)
        return super().update(instance, validated_data)