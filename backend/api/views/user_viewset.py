import logging
import mimetypes
import uuid
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from ..models import User
from ..serializers import UserSerializer, RestrictedUserSerializer
from ..permissions import RolePermissions
from ..decorators import check_permission
import os

logger = logging.getLogger(__name__)

# ------------------ PROFILE PICTURE ------------------
ALLOWED_TYPES = ['image/jpeg', 'image/png']
MAX_FILE_SIZE = 2 * 1024 * 1024

def generate_unique_filename(filename):
    ext = os.path.splitext(filename)[1]
    return f"{uuid.uuid4()}{ext}"


# ------------------ USER VIEWS ------------------
class UserViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR USERS (CRUD OPERATIONS)
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        # Dla operacji update/partial_update używamy pełnego serializera
        if self.action in ['update', 'partial_update']:
            return UserSerializer
        # Jeśli użytkownik jest superuserem, używamy pełnego serializera
        if self.request.user.is_superuser:
            return UserSerializer
        return RestrictedUserSerializer

    def get_queryset(self):
        perms = RolePermissions.get_permissions_for_role(self.request.user.role)
        if not perms['can_view_users']:
            return User.objects.filter(pk=self.request.user.pk)
        return User.objects.all()

    def get_object(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            if self.request.user.role == 'Boss':
                return get_object_or_404(User, pk=self.kwargs.get('pk'))
            else:
                return self.request.user
        return super().get_object()

    @check_permission('can_view_users', 'No permissions to view users.')
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer_class()(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        return Response(
            {'detail': 'Creating users via this endpoint is not allowed.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    @check_permission('can_view_users', 'No permissions to view users.')
    def retrieve(self, request, pk=None):
        user = self.get_object()
        serializer = self.get_serializer_class()(user)
        return Response(serializer.data)
    
    @check_permission('can_edit_users', 'No permissions to edit users.')
    def update(self, request, *args, **kwargs):
        user = self.get_object()

        data = request.data.copy()

        if 'profile_picture' in request.FILES:
            file_obj = request.FILES['profile_picture']
            file_obj.name = generate_unique_filename(file_obj.name)
            data['profile_picture'] = file_obj
        if 'contract_file' in request.FILES:
            file_obj = request.FILES['contract_file']
            file_obj.name = generate_unique_filename(file_obj.name)
            data['contract_file'] = file_obj

        # Używamy get_serializer, który może mieć dodatkowe zachowania skonfigurowane
        serializer = self.get_serializer_class()(user, data=data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @check_permission('can_edit_users', 'No permissions to edit users.')
    def partial_update(self, request, *args, **kwargs):
        user = self.get_object()

        data = request.data.copy()
        if 'profile_picture' in request.FILES:
            file_obj = request.FILES['profile_picture']
            file_obj.name = generate_unique_filename(file_obj.name)
            data['profile_picture'] = file_obj
        if 'contract_file' in request.FILES:
            file_obj = request.FILES['contract_file']
            file_obj.name = generate_unique_filename(file_obj.name)
            data['contract_file'] = file_obj

        serializer = self.get_serializer_class()(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @check_permission('can_delete_users', 'No permissions to delete users.')
    def destroy(self, request, pk=None):
        user = self.get_object()
        user.delete()
        return Response({'detail': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
    @check_permission('can_edit_password', 'No permissions to change password.')
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'detail': 'Invalid old password.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def upload_profile_picture(self, request):
        """
        Custom action to upload profile picture, and update first_name and last_name fields
        """
        user = request.user
        file = request.FILES.get('profile_picture')

        if file:
            mime_type = file.content_type
            if mime_type not in ALLOWED_TYPES:
                return Response({'detail': 'Invalid file type. Allowed types: JPEG, PNG'}, status=status.HTTP_400_BAD_REQUEST)
            
            if file.size > MAX_FILE_SIZE:
                return Response({'detail': 'File too large. Max size: 2MB'}, status=status.HTTP_400_BAD_REQUEST)

            file.name = generate_unique_filename(file.name)
        
        data = {}
        if file:
            data['profile_picture'] = file
        if request.data.get('first_name'):
            data['first_name'] = request.data.get('first_name')
        if request.data.get('last_name'):
            data['last_name'] = request.data.get('last_name')

        serializer = self.get_serializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
