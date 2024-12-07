from rest_framework.permissions import BasePermission

class IsBossUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Boss')


class RolePermissions:
    ROLE_PERMISSIONS = {
        'Boss': {
            'can_view_projects': True,
            'can_create_projects': True,
            'can_edit_projects': True,
            'can_delete_projects': True
        },
        'Employee': {
            'can_view_projects': True,
            'can_create_projects': False,
            'can_edit_projects': False,
            'can_delete_projects': False
        }
    }

    @classmethod
    def get_permissions_for_role(cls, role):
        return cls.ROLE_PERMISSIONS.get(role, {
            'can_view_projects': False,
            'can_create_projects': False,
            'can_edit_projects': False,
            'can_delete_projects': False
        })