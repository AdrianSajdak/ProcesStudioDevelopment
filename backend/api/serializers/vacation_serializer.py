from rest_framework import serializers
from ..models import Vacation, User
from .restricted_user_serializer import RestrictedUserSerializer
import uuid
from datetime import timedelta
from decimal import Decimal

class VacationSerializer(serializers.ModelSerializer):
    assigned_user = RestrictedUserSerializer(read_only=True)
    assigned_user_id = serializers.IntegerField(write_only=True)

    start_date = serializers.DateField(write_only=True)
    end_date = serializers.DateField(write_only=True, required=False, allow_null=True)

    duration = serializers.DecimalField(max_digits=4, decimal_places=1, required=False, default=Decimal('8.0'))

    class Meta:
        model = Vacation
        fields = [
            'vacation_id', 'assigned_user_id', 'assigned_user',
            'vacation_date', 'duration', 'status', 'comments', 'type',
            'vacation_group_id', 'start_date', 'end_date'
        ]
        read_only_fields = ['vacation_id', 'vacation_date', 'vacation_group_id']


    def create(self, validated_data):
        start_date = validated_data.pop('start_date')
        end_date = validated_data.pop('end_date', None)
        if end_date == "":
            end_date = None

        user_id = validated_data.pop('assigned_user_id')
        user = User.objects.get(pk=user_id)

        group_id = uuid.uuid4()
        vacations_created = []
        if end_date:
            current_date = start_date
            while current_date <= end_date:
                # Pomijamy weekendy: sobota (5) oraz niedziela (6)
                if current_date.weekday() not in (5, 6):
                    vac = Vacation.objects.create(
                        assigned_user=user,
                        vacation_date=current_date,
                        duration=validated_data.get('duration', 8),
                        status=validated_data.get('status', 'PENDING'),
                        comments=validated_data.get('comments', ''),
                        type=validated_data.get('type', 'UNPAID'),
                        vacation_group_id=group_id
                    )
                    vacations_created.append(vac)
                current_date += timedelta(days=1)
            return vacations_created[0] if vacations_created else None
        else:
            vac = Vacation.objects.create(
                assigned_user=user,
                vacation_date=start_date,
                duration=validated_data.get('duration', 8),
                status=validated_data.get('status', 'PENDING'),
                comments=validated_data.get('comments', ''),
                type=validated_data.get('type', 'UNPAID'),
                vacation_group_id=group_id
            )
            return vac

    def update(self, instance, validated_data):
        if 'assigned_user_id' in validated_data:
            user_id = validated_data.pop('assigned_user_id')
            instance.assigned_user = User.objects.get(pk=user_id)
        return super().update(instance, validated_data)