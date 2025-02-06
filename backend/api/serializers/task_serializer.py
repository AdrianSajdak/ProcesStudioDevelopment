from rest_framework import serializers
from ..models import Task, Project, User
from .project_serializer import ProjectSerializer
from .restricted_user_serializer import RestrictedUserSerializer

class TaskSerializer(serializers.ModelSerializer):
    assigned_project = ProjectSerializer(read_only=True)
    assigned_user = RestrictedUserSerializer(read_only=True)
    assigned_project_id = serializers.IntegerField(write_only=True, required=True)
    assigned_user_id = serializers.IntegerField(write_only=True, required=True)
    
    class Meta:
        model = Task
        fields = [
            'task_id', 'assigned_project_id', 'assigned_user_id',
            'assigned_project', 'assigned_user',
            'name', 'description', 'total_hours', 'status',
            'created_date', 'end_date', 'last_modification_date', 'author',
        ]
        depth = 1
        read_only_fields = [
            'task_id', 'total_hours', 'created_date',
            'last_modification_date', 'author',
        ]

    def create(self, validated_data):
        project_id = validated_data.pop('assigned_project_id')
        user_id = validated_data.pop('assigned_user_id')

        project_obj = Project.objects.get(pk=project_id)
        user_obj = User.objects.get(pk=user_id)

        task = Task.objects.create(
            assigned_project=project_obj,
            assigned_user=user_obj,
            **validated_data
        )
        return task