from rest_framework import serializers
from ..models import User

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'user_id', 'username', 'email', 'role', 'is_superuser',
            'first_name', 'last_name', 'date_of_birth',
            'pesel', 'gender', 'profile_picture', 'residential_address',
            'mailing_address', 'work_phone', 'private_phone',
            'employment_date', 'contract_type', 'contract_file',
            'work_percentage', 'position', 'salary_rate', 'bank_account',
        ]
        read_only_fields = ['user_id']