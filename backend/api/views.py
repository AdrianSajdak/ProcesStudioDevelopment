from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
import uuid
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action

from .models import User, Project, Phase, Task, Post, Client
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProjectSerializer,
    PhaseSerializer,
    TaskSerializer,
    PostSerializer,
    ClientSerializer
)
from .permissions import IsBossUser, RolePermissions

import mimetypes
from rest_framework.views import APIView

# ------------------ PROFILE PICTURE ------------------
ALLOWED_TYPES = ['image/jpeg', 'image/png']
MAX_FILE_SIZE = 2 * 1024 * 1024

def generate_unique_filename(filename):
    extension = filename.split('.')[-1]
    return f"{uuid.uuid4()}.{extension}"

# ------------------ REGISTRATION ------------------
class RegisterView(generics.CreateAPIView):
    """
    VIEW FOR REGISTERING NEW USERS
    """
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Registration successful.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------ USER VIEWS ------------------
class UserViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR USERS (CRUD OPERATIONS)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'Boss':
            return User.objects.all()
        else:
            return User.objects.filter(pk=user.pk)

    def get_object(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            if self.request.user.role == 'Boss':
                return get_object_or_404(User, pk=self.kwargs.get('pk'))
            else:
                return self.request.user
        return super().get_object()

    def list(self, request):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not IsBossUser().has_permission(request, self) or not perms['can_view_users']:
            return Response(
                {'detail': 'No permissions to view users.'},
                status=403
            )
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        return Response(
            {'detail': 'Creating users via this endpoint is not allowed.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def retrieve(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not IsBossUser().has_permission(request, self) or not perms['can_view_users']:
            return Response({'detail': 'No permissions to view users.'}, status=403)
        user = self.get_object()
        serializer = self.serializer_class(user)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not IsBossUser().has_permission(request, self) or not perms['can_edit_users']:
            return Response({'detail': 'No permissions to edit users.'}, status=403)
        user = self.get_object()
        serializer = self.serializer_class(user, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def partial_update(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not IsBossUser().has_permission(request, self) or not perms['can_edit_users']:
            return Response({'detail': 'No permissions to edit users.'}, status=status.HTTP_403_FORBIDDEN)
        user = self.get_object()
        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not IsBossUser().has_permission(request, self) or not perms['can_delete_users']:
            return Response({'detail': 'No permissions to delete users.'}, status=403)
        user = self.get_object()
        user.delete()
        return Response(status=204)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_edit_password', False):
            return Response({'detail': 'No permissions to change password.'}, status=403)

        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'detail': 'Invalid old password.'}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({'detail': 'Password changed successfully.'}, status=200)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def upload_profile_picture(self, request):
        """
        Custom action to upload profile picture, and update first_name and last_name fields
        """
        user = request.user
        file = request.FILES.get('profile_picture')

        if file:
            mime_type = mimetypes.guess_type(file.name)[0]
            if mime_type not in ALLOWED_TYPES:
                return Response({'detail': 'Invalid file type. Allowed types: JPEG, PNG'}, status=status.HTTP_400_BAD_REQUEST)
            
            if file.size > MAX_FILE_SIZE:
                return Response({'detail': 'File too large. Max size: 2MB'}, status=status.HTTP_400_BAD_REQUEST)

            file.name = generate_unique_filename(file.name)
        
        allowed_fields = ['profile_picture', 'first_name', 'last_name']
        data = {key: request.data.get(key) for key in allowed_fields if request.data.get(key)}

        serializer = self.get_serializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# ------------------ PROJECT VIEWS ------------------
class ProjectViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR PROJECTS (CRUD OPERATIONS)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        return Project.objects.filter(status__in=['OPEN', 'SUSPENDED'])

    def list(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_view_projects', False):
            return Response(
                {"detail": "You don't have permissions to view projects."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_create_projects', False):
            return Response(
                {"detail": "You don't have permissions to create projects."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def retrieve(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_view_projects', False):
            return Response(
                {"detail": "You don't have permissions to view projects."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().retrieve(request, pk)

    def update(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_edit_projects', False):
            return Response(
                {"detail": "No permissions to edit projects."},
                status=status.HTTP_403_FORBIDDEN
            )
        partial = kwargs.pop('partial', False)
        return super().update(request, partial=partial, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_edit_projects', False):
            return Response(
                {"detail": "No permissions to edit projects."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_delete_projects', False):
            return Response(
                {"detail": "You don't have permissions to delete projects."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, pk)


# ------------------ PHASE VIEWS ------------------
class PhaseViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR PHASES (CRUD OPERATIONS)
    """
    serializer_class = PhaseSerializer
    permission_classes = [IsAuthenticated]
    queryset = Phase.objects.all()
    
    def get_queryset(self):
        perms = RolePermissions.get_permissions_for_role(self.request.user.role)
        if not perms.get('can_view_phases', False):
            return Phase.objects.none()

        queryset = Phase.objects.all()

        assigned_project_id  = self.request.query_params.get('assigned_project', None)
        if assigned_project_id  is not None:
            queryset = queryset.filter(assigned_project_id=assigned_project_id )

        return queryset
        
    def list(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_view_phases', False):
            return Response(
                {"detail": "You don't have permissions to view phases."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_create_phases', False):
            return Response(
                {"detail": "You don't have permissions to create phases."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_edit_phases', False):
            return Response(
                {"detail": "No permissions to edit phases."},
                status=status.HTTP_403_FORBIDDEN
            )
        partial = kwargs.pop('partial', False)
        return super().update(request, partial=partial, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_edit_phases', False):
            return Response(
                {"detail": "No permissions to edit phases."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_delete_phases', False):
            return Response(
                {"detail": "You don't have permissions to delete phases."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, pk)
    
    def retrieve(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_view_phases', False):
            return Response(
                {"detail": "You don't have permissions to view phases."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().retrieve(request, pk)


# ------------------ TASK VIEWS ------------------
class TaskViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR TASKS (CRUD OPERATIONS)
    """
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perms = RolePermissions.get_permissions_for_role(self.request.user.role)
        if not perms.get('can_view_all_tasks', False):
            return Task.objects.filter(
                assigned_user=self.request.user,
                status__in=['OPEN', 'SUSPENDED']
            )
        return Task.objects.filter(status__in=['OPEN', 'SUSPENDED'])
    
    def create(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_create_tasks', False):
            return Response(
                {"detail": "You don't have permissions to create tasks."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_edit_tasks', False):
            return Response(
                {"detail": "You don't have permissions to edit tasks."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, partial=partial, **kwargs)

    
    def partial_update(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_edit_tasks', False):
            return Response(
                {"detail": "You don't have permissions to edit tasks."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_delete_tasks', False):
            return Response(
                {"detail": "You don't have permissions to delete tasks."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, pk)
    
    def retrieve(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_view_all_tasks', False):
            obj = get_object_or_404(Task, pk=pk)
            if obj.assigned_user != request.user:
                return Response({
                    "detail": "You don't have permissions to view this task."
                    }, status=status.HTTP_403_FORBIDDEN)
        return super().retrieve(request, pk)


# ------------------ POST VIEWS ------------------
class PostViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR POSTS (CRUD OPERATIONS)
    """
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perms = RolePermissions.get_permissions_for_role(self.request.user.role)
        if perms.get('can_view_all_posts', False):
            queryset = Post.objects.all()

            assigned_task_id = self.request.query_params.get('assigned_task', None)
            if assigned_task_id is not None:
                queryset = queryset.filter(assigned_task_id=assigned_task_id)

            return queryset
        elif perms.get('can_view_own_posts', False):
            return Post.objects.filter(assigned_task__assigned_user=self.request.user)
        else:
            return Post.objects.none()
        
    def create(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_create_posts', False):
            return Response(
                {"detail": "You don't have permissions to create posts."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_edit_posts', False):
            return Response(
                {"detail": "You don't have permissions to edit posts."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, partial=partial, **kwargs)

    
    def partial_update(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_edit_posts', False):
            return Response(
                {"detail": "You don't have permissions to edit posts."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_delete_posts', False):
            return Response(
                {"detail": "You don't have permissions to delete posts."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, pk)
    
    def retrieve(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_view_posts', False):
            return Response(
                {"detail": "You don't have permissions to view posts."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().retrieve(request, pk)


# ------------------ CLIENT VIEWS ------------------
class ClientViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR CLIENTS (CRUD OPERATIONS)
    """
    serializer_class = ClientSerializer
    queryset = Client.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perms = RolePermissions.get_permissions_for_role(self.request.user.role)
        if perms.get('can_view_clients', False):
            return Client.objects.all()
        else:
            return Client.objects.none()
        
    def create(self, request, *args, **kwargs):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_create_clients', False):
            return Response(
                {"detail": "You don't have permissions to create clients."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_edit_clients', False):
            return Response(
                {"detail": "You don't have permissions to edit clients."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, pk)
    
    def destroy(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_delete_clients', False):
            return Response(
                {"detail": "You don't have permissions to delete clients."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, pk)
    
    def retrieve(self, request, pk=None):
        perms = RolePermissions.get_permissions_for_role(request.user.role)
        if not perms.get('can_view_clients', False):
            return Response(
                {"detail": "You don't have permissions to view clients."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().retrieve(request, pk)