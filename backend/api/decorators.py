from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from .permissions import RolePermissions

def check_permission(permission_name, error_message=None):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(self, request, *args, **kwargs):
            perms = RolePermissions.get_permissions_for_role(request.user.role)
            if not perms.get(permission_name, False):
                return Response(
                    {"detail": error_message or f"No permission: {permission_name}"},
                    status=status.HTTP_403_FORBIDDEN
                )
            return view_func(self, request, *args, **kwargs)
        return wrapper
    return decorator