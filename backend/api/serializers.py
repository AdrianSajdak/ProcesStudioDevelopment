from rest_framework import serializers
from .models import *

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('name', 'start_date', 'end_date', 'comments', 'status', 'created', 'modified')
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('first_name', 'last_name', 'email')