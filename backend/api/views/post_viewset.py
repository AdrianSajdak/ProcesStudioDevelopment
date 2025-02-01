import logging
from datetime import timedelta
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from ..models import Post
from ..serializers import PostSerializer
from ..permissions import RolePermissions
from ..decorators import check_permission

logger = logging.getLogger(__name__)

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

        one_year_ago = timezone.now().date() - timedelta(days=365)

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
    
    @check_permission('can_view_all_posts', 'No permissions to view posts.')
    def retrieve(self, request, pk=None):
        return super().retrieve(request, pk)