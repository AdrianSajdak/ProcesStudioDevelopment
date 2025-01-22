from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
import uuid
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model

from .models import User, Project, Phase, Task, Post, Client, Vacation, Notification
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProjectSerializer,
    PhaseSerializer,
    TaskSerializer,
    PostSerializer,
    ClientSerializer,
    VacationSerializer,
    NotificationSerializer
)
from .permissions import RolePermissions
from .notification_variables import PROJECT_NOTIFICATIONS, PHASE_NOTIFICATIONS, TASK_NOTIFICATIONS, VACATION_NOTIFICATIONS, CLIENT_NOTIFICATIONS

from .decorators import check_permission

import mimetypes
from rest_framework.views import APIView

# ------------------ NOTIFICATION ------------------
def create_notifications_with_permissions(permission_name, notification_type, title, message, recipient=None):
    User = get_user_model()

    # NOTIFICATION FOR A SPECIFIC USER
    if recipient:
        perms = RolePermissions.get_permissions_for_role(recipient.role)
        if perms.get(permission_name, False):
            Notification.objects.create(
                recipient=recipient,
                type=notification_type,
                title=title,
                message=message
            )
        return
    
    # NOTIFICATIONS FOR A GROUP OF PRIVILEGED USERS
    for user in User.objects.filter(is_active=True):
        perms = RolePermissions.get_permissions_for_role(user.role)
        if perms.get(permission_name, False):
            Notification.objects.create(
                recipient=user,
                type=notification_type,
                title=title,
                message=message
            )
    

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
    permission_classes = [IsAuthenticated]
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
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        return Response(
            {'detail': 'Creating users via this endpoint is not allowed.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    @check_permission('can_view_users', 'No permissions to view users.')
    def retrieve(self, request, pk=None):
        user = self.get_object()
        serializer = self.serializer_class(user)
        return Response(serializer.data)
    
    @check_permission('can_edit_users', 'No permissions to edit users.')
    def update(self, request, pk=None):
        user = self.get_object()
        serializer = self.serializer_class(user, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @check_permission('can_edit_users', 'No permissions to edit users.')
    def partial_update(self, request, pk=None):
        user = self.get_object()
        serializer = self.serializer_class(user, data=request.data, partial=True)

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
        # perms = RolePermissions.get_permissions_for_role(request.user.role)
        # if not perms.get('can_edit_password', False):
        #     return Response({'detail': 'No permissions to change password.'}, status=status.HTTP_403_FORBIDDEN)

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
        one_year_ago = datetime.now().date() - timedelta(days=365)
        return Project.objects.filter(created_date__gte=one_year_ago)

    @check_permission('can_view_projects', 'No permissions to view projects.')
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @check_permission('can_create_projects', 'No permissions to create projects.')
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            project_name = response.data.get('name')
            create_notifications_with_permissions(
                'can_view_project_created_notifications',
                'PROJECT',
                PROJECT_NOTIFICATIONS['created']['title'].format(project_name),
                PROJECT_NOTIFICATIONS['created']['message'].format(project_name)
            )
        return response
    
    @check_permission('can_view_projects', 'No permissions to view projects.')
    def retrieve(self, request, pk=None):
        return super().retrieve(request, pk)

    @check_permission('can_edit_projects', 'No permissions to edit projects.')
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        return super().update(request, partial=partial, *args, **kwargs)

    @check_permission('can_edit_projects', 'No permissions to edit projects.')
    def partial_update(self, request, *args, **kwargs):
        project = self.get_object()
        old_status = project.status

        response = super().partial_update(request, *args, **kwargs)

        if response.status_code in [200, 202]:
            new_status = response.data.get('status')
            project_name = response.data.get('name')
            if old_status != project.status:
                create_notifications_with_permissions(
                    'can_view_project_updated_notifications',
                    'PROJECT',
                    PROJECT_NOTIFICATIONS['status_changed']['title'].format(project_name),
                    PROJECT_NOTIFICATIONS['status_changed']['message'].format(old_status, new_status)
                )

        return response

    @check_permission('can_delete_projects', 'No permissions to delete projects.')
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)
    
    def perform_update(self, serializer):
        """
        After updating the project, if the status is CLOSED,
        close all phases and tasks that are not yet closed.
        """
        project = serializer.save()
        if project.status == 'CLOSED':
            Phase.objects.filter(assigned_project=project).exclude(status='CLOSED').update(status='CLOSED')
            Task.objects.filter(assigned_project=project).exclude(status='CLOSED').update(status='CLOSED')


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

        one_year_ago = datetime.now().date() - timedelta(days=365)

        if not perms.get('can_view_phases', False):
            return Phase.objects.none()

        queryset = Phase.objects.filter(
            assigned_project__created_date__gte=one_year_ago
        )

        assigned_project_id  = self.request.query_params.get('assigned_project', None)
        if assigned_project_id  is not None:
            queryset = queryset.filter(assigned_project_id=assigned_project_id )

        return queryset
    
    @check_permission('can_view_phases', 'No permissions to view phases.')
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @check_permission('can_create_phases', 'No permissions to create phases.')
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            phase_name = response.data.get('name')
            create_notifications_with_permissions(
                'can_view_phase_created_notifications',
                'PHASE',
                PHASE_NOTIFICATIONS['created']['title'].format(phase_name),
                PHASE_NOTIFICATIONS['created']['message']
            )
        return response
    
    @check_permission('can_edit_phases', 'No permissions to edit phases.')
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        return super().update(request, partial=partial, *args, **kwargs)

    @check_permission('can_edit_phases', 'No permissions to edit phases.')
    def partial_update(self, request, *args, **kwargs):
        phase = self.get_object()
        old_status = phase.status

        response = super().partial_update(request, *args, **kwargs)

        if response.status_code in [200, 202] and old_status != response.data.get('status'):
            create_notifications_with_permissions(
                'can_view_phase_updated_notifications',
                'PHASE',
                PHASE_NOTIFICATIONS['status_changed']['title'].format(phase.name),
                PHASE_NOTIFICATIONS['status_changed']['message'].format(
                    old_status,
                    response.data.get('status')
                )
            )
        return response
    
    @check_permission('can_delete_phases', 'No permissions to delete phases.')
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)
    
    @check_permission('can_view_phases', 'No permissions to view phases.')
    def retrieve(self, request, pk=None):
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

        one_year_ago = datetime.now().date() - timedelta(days=365)
    
        if not perms.get('can_view_all_tasks', False):
            return Task.objects.filter(
                assigned_user=self.request.user,
                created_date__gte=one_year_ago
            )
        return Task.objects.filter(created_date__gte=one_year_ago)
    
    @check_permission('can_create_tasks', 'No permissions to create tasks.')
    def create(self, request, *args, **kwargs):
        
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            assigned_user = response.data.get('assigned_user')
            if assigned_user:
                create_notifications_with_permissions(
                    'can_view_task_created_notifications',
                    'TASK',
                    TASK_NOTIFICATIONS['created']['title'].format(assigned_user['username']),
                    TASK_NOTIFICATIONS['created']['message'],
                    recipient=User.objects.get(id=assigned_user['user_id'])
                )
        return response
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @check_permission('can_edit_tasks', 'No permissions to edit tasks.')
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        return super().update(request, *args, partial=partial, **kwargs)

    @check_permission('can_edit_tasks', 'No permissions to edit tasks.')
    def partial_update(self, request, *args, **kwargs):
        task = self.get_object()
        old_status = task.status
        
        response = super().partial_update(request, *args, **kwargs)
    
        if response.status_code in [200, 202] and old_status != response.data.get('status'):
            create_notifications_with_permissions(
                'can_view_task_updated_notifications',
                'TASK',
                TASK_NOTIFICATIONS['status_changed']['title'].format(task.name),
                TASK_NOTIFICATIONS['status_changed']['message'].format(
                    old_status, response.data.get('status')
                ),
                recipient=task.assigned_user
            )
        return response

    @check_permission('can_delete_tasks', 'No permissions to delete tasks.')
    def destroy(self, request, pk=None):
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
    
    def perform_update(self, serializer):
        original_task = self.get_object()
        original_status = original_task.status
        
        task = serializer.save()
        
        if original_status != 'CLOSED' and task.status == 'CLOSED':
            task.end_date = datetime.now()
            task.save()


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

        one_year_ago = datetime.now().date() - timedelta(days=365)

        if perms.get('can_view_all_posts', False):
            queryset = Post.objects.filter(post_date__gte=one_year_ago)

            assigned_task_id = self.request.query_params.get('assigned_task', None)
            if assigned_task_id is not None:
                queryset = queryset.filter(assigned_task_id=assigned_task_id)

            return queryset
        elif perms.get('can_view_own_posts', False):
            queryset = Post.objects.filter(
                assigned_task__assigned_user=self.request.user,
                post_date__gte=one_year_ago
            )

            assigned_task_id = self.request.query_params.get('assigned_task', None)
            if assigned_task_id is not None:
                queryset = queryset.filter(assigned_task_id=assigned_task_id)
            
            return queryset
        else:
            return Post.objects.none()
    
    @check_permission('can_create_posts', 'No permissions to create posts.')
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    @check_permission('can_edit_posts', 'No permissions to edit posts.')
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        return super().update(request, *args, partial=partial, **kwargs)

    @check_permission('can_edit_posts', 'No permissions to edit posts.')
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @check_permission('can_delete_posts', 'No permissions to delete posts.')
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)
    
    @check_permission('can_view_posts', 'No permissions to view posts.')
    def retrieve(self, request, pk=None):
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
    
    @check_permission('can_create_clients', 'No permissions to create clients.')
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            create_notifications_with_permissions(
                'can_view_client_created_notifications',
                'CLIENT',
                CLIENT_NOTIFICATIONS['created']['title'].format(response.data.get('name')),
                CLIENT_NOTIFICATIONS['created']['message'].format(response.data.get('name'))
            )
        
        return response
    
    @check_permission('can_edit_clients', 'No permissions to edit clients.')
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        response = super().update(request, *args, partial=partial, **kwargs)

        if response.status_code in [200, 202]:
            create_notifications_with_permissions(
                'can_view_client_updated_notifications',
                'CLIENT',
                CLIENT_NOTIFICATIONS['updated']['title'].format(response.data.get('name')),
                CLIENT_NOTIFICATIONS['updated']['message']
            )        
        return response

    @check_permission('can_edit_clients', 'No permissions to edit clients.')
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @check_permission('can_delete_clients', 'No permissions to delete clients.')
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)
    
    @check_permission('can_view_clients', 'No permissions to view clients.')    
    def retrieve(self, request, pk=None):
        return super().retrieve(request, pk)
    

# ------------------ VACATION VIEWS ------------------
class VacationViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR VACATIONS (CRUD OPERATIONS)
    """
    serializer_class = VacationSerializer
    queryset = Vacation.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perms = RolePermissions.get_permissions_for_role(self.request.user.role)

        one_year_ago = datetime.now().date() - timedelta(days=365)

        if not perms.get('can_view_all_vacations', False):
            return Vacation.objects.filter(
                assigned_user=self.request.user,
                vacation_date__gte=one_year_ago,
                status__in=['PENDING', 'CONFIRMED']
            )
        return Vacation.objects.filter(vacation_date__gte=one_year_ago, status__in=['PENDING', 'CONFIRMED'])
        
    @check_permission('can_create_vacations', 'No permissions to create vacations.')
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            if request.user.role == 'Employee':
                create_notifications_with_permissions(
                'can_view_vacation_created_notifications',
                'VACATION',
                VACATION_NOTIFICATIONS['created']['title'].format(request.user.username),
                VACATION_NOTIFICATIONS['created']['message'].format(request.user.username)
            )
        return response

    @check_permission('can_edit_vacations', 'No permissions to edit vacations.')
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        return super().update(request, *args, partial=partial, **kwargs)

    @check_permission('can_edit_vacations', 'No permissions to edit vacations.')
    def partial_update(self, request, *args, **kwargs):
        vacation = self.get_object()
        response = super().partial_update(request, *args, **kwargs)

        if response.status_code in [200, 202]:
            new_status = response.data.get('status')
            notification_type = 'confirmed' if new_status == 'CONFIRMED' else 'rejected'
            
            create_notifications_with_permissions(
                'can_view_vacation_updated_notifications',
                'VACATION',
                VACATION_NOTIFICATIONS[notification_type]['title'].format(vacation.start_date),
                VACATION_NOTIFICATIONS[notification_type]['message'].format(vacation.user.username),
                recipient=vacation.user
            )

        return response
    
    @check_permission('can_delete_vacations', 'No permissions to delete vacations.')
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)
    

# ------------------ NOTIFICATION VIEWS ------------------ 

class NotificationViewSet(viewsets.ModelViewSet):
    """
    VIEWSET FOR NOTIFICATIONS
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()

    def get_queryset(self):
        user = self.request.user

        queryset = Notification.objects.exclude(is_read=True)

        if user.role == 'Boss':
            return queryset.filter(recipient=None).order_by('-created_at')
        else:
            # FUTURE IMPLEMENTATION OF NOTIFICATIONS FOR EMPLOYEES
            return queryset.filter(recipient=user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        return Response(
            {'detail': 'Creating notifications via this endpoint is not allowed.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    @action(detail=True, methods=['patch'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()

        notification.is_read = True
        notification.save()

        return Response({'detail': 'Notification marked as read.'}, status=status.HTTP_200_OK)