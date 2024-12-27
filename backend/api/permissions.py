from rest_framework.permissions import BasePermission

class IsBossUser(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'Boss'
            )


class RolePermissions:
    ROLE_PERMISSIONS = {
        'Boss': {
            # PROJECTS
            'can_view_projects': True,
            'can_create_projects': True,
            'can_edit_projects': True,
            'can_delete_projects': True,
            # TASKS
            'can_view_all_tasks': True,
            'can_create_tasks': True,
            'can_edit_all_task_fields': True,
            'can_edit_task_comments_hours': True,
            'can_delete_tasks': False,
            # USERS
            'can_view_users': True,
        },
        'Employee': {
            # PROJECTS
            'can_view_projects': True,
            'can_create_projects': False,
            'can_edit_projects': False,
            'can_delete_projects': False,
            # TASKS
            'can_view_all_tasks': False,
            'can_create_tasks': False,
            'can_edit_all_task_fields': False,
            'can_edit_task_comments_hours': True,
            'can_delete_tasks': False,
            # USERS
            'can_view_users': False,
        }
    }

    @classmethod
    def get_permissions_for_role(cls, role):
        return cls.ROLE_PERMISSIONS.get(role, {
            # PROJECTS
            'can_view_projects': False,
            'can_create_projects': False,
            'can_edit_projects': False,
            'can_delete_projects': False,
            # TASKS
            'can_view_all_tasks': False,
            'can_create_tasks': False,
            'can_edit_all_task_fields': False,
            'can_edit_task_comments_hours': False,
            # USERS
            'can_view_users': False,
        })