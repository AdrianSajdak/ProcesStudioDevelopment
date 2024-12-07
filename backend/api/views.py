from rest_framework import viewsets, permissions, status
from .models import Project, User
from .serializers import ProjectSerializer, UserSerializer, RegisterSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from .permissions import IsBossUser, RolePermissions
from rest_framework.parsers import MultiPartParser, FormParser
import uuid
import mimetypes

User = get_user_model()

ALLOWED_TYPES = ['image/jpeg', 'image/png']
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2 MB

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