from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from rest_framework.validators import UniqueValidator


# PROJECTS
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('name', 'start_date', 'end_date', 'comments', 'status', 'created', 'modified')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'profile_picture', 'first_name', 'last_name')


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
        fields = ('username', 'password', 'email', 'role')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        # Hashowanie hasła
        if password is not None:
            user.password = make_password(password)
        user.save()
        return user