from rest_framework import serializers
from ..models import Vacation, User
from . import UserSerializer

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