from rest_framework import viewsets, permissions, status
from .models import Project, User, Task
from .serializers import ProjectSerializer, UserSerializer, RegisterSerializer, TaskSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from .permissions import IsBossUser, RolePermissions
from rest_framework.parsers import MultiPartParser, FormParser
import uuid
import mimetypes
from rest_framework import generics

User = get_user_model()

ALLOWED_TYPES = ['image/jpeg', 'image/png']
MAX_FILE_SIZE = 2 * 1024 * 1024

def generate_unique_filename(filename):
    extension = filename.split('.')[-1]
    return f"{uuid.uuid4()}.{extension}"

class ProjectViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def list(self, request):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        if not IsBossUser().has_permission(request, self):
            return Response({'detail': 'Brak uprawnień.'}, status=403)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        project = Project.objects.get(pk=pk)
        serializer = self.serializer_class(project)
        return Response(serializer.data)

    def update(self, request, pk=None):
        if not IsBossUser().has_permission(request, self):
            return Response({'detail':'Brak uprawnień.'}, status=403)

        project = self.queryset.get(pk=pk)
        serializer = self.serializer_class(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        if not IsBossUser().has_permission(request, self):
            return Response({'detail':'Brak uprawnień.'}, status=403)

        project = self.queryset.get(pk=pk)
        project.delete()
        return Response(status=204)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Użytkownik zarejestrowany pomyślnie.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserSerializer(request.user)
        capabilities = RolePermissions.get_permissions_for_role(request.user.role)
        data = serializer.data
        data['capabilities'] = capabilities
        return Response(data)

    def post(self, request):
        user = request.user
        file = request.FILES.get('profile_picture')

        if file:
            mime_type = mimetypes.guess_type(file.name)[0]
            if mime_type not in ALLOWED_TYPES:
                return Response({'error': 'Invalid file type. Allowed types: JPEG, PNG'}, status=400)

            if file.size > MAX_FILE_SIZE:
                return Response({'error': 'File size exceeds the 2MB limit.'}, status=400)

            file.name = generate_unique_filename(file.name)

        allowed_fields = ['profile_picture', 'first_name', 'last_name']
        data = {key: request.data[key] for key in request.data if key in allowed_fields}

        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    
class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    def get_queryset(self):
        user = self.request.user
        perms = RolePermissions.get_permissions_for_role(user.role)

        if perms.get('can_view_all_tasks'):
            return Task.objects.all()
        else:
            return Task.objects.filter(assigned_user=user, status='Open')

    def create(self, request, *args, **kwargs):
        user = request.user
        perms = RolePermissions.get_permissions_for_role(user.role)
        if not perms['can_create_tasks']:
            return Response({'detail': 'Brak uprawnień do tworzenia tasków.'}, status=403)
        data = request.data.copy()
        data['author'] = user.id
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save(author=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        user = request.user
        perms = RolePermissions.get_permissions_for_role(user.role)
        task = self.get_object()

        if perms.get('can_edit_all_task_fields'):
            serializer = self.get_serializer(task, data=request.data, partial=True)
        elif perms.get('can_edit_task_comments_hours'):
            allowed_fields = ['comments', 'work_hours']
            data = {k: v for k, v in request.data.items() if k in allowed_fields}
            serializer = self.get_serializer(task, data=data, partial=True)
        else:
            return Response({'detail': 'Brak uprawnień do edycji tasków.'}, status=403)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def destroy(self, request, *args, **kwargs):
        user = request.user
        perms = RolePermissions.get_permissions_for_role(user.role)

        if not perms.get('can_delete_tasks'):
            return Response({'detail': 'Brak uprawnień do usuwania tasków.'}, status=403)

        task = self.get_object()
        task.delete()
        return Response(status=204)
    
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()

    def list(self, request):
        user = request.user
        perms = RolePermissions.get_permissions_for_role(user.role)

        if not IsBossUser().has_permission(request, self) or not perms['can_view_users']:
            return Response({'detail': 'Brak uprawnień.'}, status=403)
        
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    