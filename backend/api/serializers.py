from rest_framework import serializers
from .models import *
from rest_framework.validators import UniqueValidator
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'user_id', 'username', 'email', 'role',
            'profile_picture', 'first_name', 'last_name'
        ]
        read_only_fields = ['user_id']

class ClientSerializer(serializers.ModelSerializer):
    nip = serializers.CharField(
        required=False,
        allow_blank=True,
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



class TaskSerializer(serializers.ModelSerializer):
    assigned_project = ProjectSerializer(read_only=True)
    assigned_user = UserSerializer(read_only=True)
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

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True, 
        validators=[UniqueValidator(queryset=User.objects.all(), message="Użytkownik o takiej nazwie już istnieje.")]
    )
    email = serializers.EmailField(
        required=True, 
        validators=[UniqueValidator(queryset=User.objects.all(), message="Ten adres email jest już zajęty.")]
    )
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'user_id', 'username', 'email', 'role',
            'profile_picture', 'password'
        ]
        read_only_fields = ['user_id']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        
        if password is not None:
            user.password = make_password(password)
        user.save()
        return user


class VacationSerializer(serializers.ModelSerializer):
    assigned_user = UserSerializer(read_only=True)
    assigned_user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Vacation
        fields = [
            'vacation_id', 'assigned_user_id', 'assigned_user',
            'vacation_date', 'duration', 'status','comments'
        ]
        read_only_fields = ['vacation_id']


    def create(self, validated_data):
        user_id = validated_data.pop('assigned_user_id')
        user = User.objects.get(pk=user_id)
        vacation = Vacation.objects.create(assigned_user=user, **validated_data)
        return vacation

    def update(self, instance, validated_data):
        if 'assigned_user_id' in validated_data:
            user_id = validated_data.pop('assigned_user_id')
            instance.assigned_user = User.objects.get(pk=user_id)
        return super().update(instance, validated_data)