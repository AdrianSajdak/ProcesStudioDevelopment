from rest_framework import serializers
from ..models import Post, Task
from . import TaskSerializer

class PostSerializer(serializers.ModelSerializer):
    assigned_task = TaskSerializer(read_only=True)
    assigned_task_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Post
        fields = [
            'post_id', 'assigned_task_id', 'assigned_task',
            'post_date', 'work_hours', 'comment'
        ]
        depth = 1
        read_only_fields = ['post_id']
        
    def create(self, validated_data):
        task_id = validated_data.pop('assigned_task_id')
        task_obj = Task.objects.get(pk=task_id)
        post = Post.objects.create(assigned_task=task_obj, **validated_data)
        return post