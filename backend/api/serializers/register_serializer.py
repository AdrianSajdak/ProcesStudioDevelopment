from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from ..models import User
from django.contrib.auth.hashers import make_password


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
            'user_id', 'username', 'email', 'role', 'first_name',
            'last_name', 'date_of_birth', 'pesel', 'gender',
            'profile_picture', 'residential_address', 'mailing_address',
            'work_phone', 'private_phone', 'employment_date',
            'contract_type', 'contract_file', 'work_percentage',
            'position', 'salary_rate', 'bank_account', 'password'
        ]
        read_only_fields = ['user_id']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        
        if password is not None:
            user.password = make_password(password)
        user.save()
        return user