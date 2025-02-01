from rest_framework import serializers
from ..models import Phase, Project
from . import ProjectSerializer

class PhaseSerializer(serializers.ModelSerializer):
    assigned_project = ProjectSerializer(read_only=True)
    assigned_project_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Phase
        fields = [
            'phase_id', 'assigned_project', 'assigned_project_id',
            'name', 'price', 'type', 'status', 'start_date', 'end_date'
        ]
        read_only_fields = ['phase_id']

    def create(self, validated_data):
        project_id = validated_data.pop('assigned_project_id')
        project = Project.objects.get(pk=project_id)
        phase = Phase.objects.create(
            assigned_project=project,
            **validated_data
        )
        return phase

    def update(self, instance, validated_data):
        if 'assigned_project_id' in validated_data:
            project_id = validated_data.pop('assigned_project_id')
            instance.assigned_project = Project.objects.get(pk=project_id)
        return super().update(instance, validated_data)