from rest_framework import serializers
from ..models import User

class RestrictedUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'user_id', 'username', 'email', 'role', 'first_name',
            'last_name', 'profile_picture','work_phone',
            'employment_date', 'contract_type', 'position', 'is_superuser'
        ]
        read_only_fields = ['user_id']