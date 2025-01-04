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
            'can_delete_projects': False,
            # PHASES
            'can_view_phases': True,
            'can_create_phases': True,
            'can_edit_phases': True,
            'can_delete_phases': False,
            # TASKS
            'can_view_all_tasks': True,
            'can_create_tasks': True,
            'can_edit_tasks': True,
            'can_delete_tasks': False,
            # USERS
            'can_view_users': True,
            'can_create_users': True,
            'can_edit_users': False,
            'can_delete_users': False,
            "can_edit_password": True,
            # POSTS
            'can_view_all_posts': True,
            'can_view_own_posts': True,
            'can_create_posts': True,
            'can_edit_posts': True,
            'can_delete_posts': False,
            # CLIENTS
            'can_view_clients': True,
            'can_create_clients': True,
            'can_edit_clients': True,
            'can_delete_clients': False,
        },
        'Employee': {
            # PROJECTS
            'can_view_projects': True,
            'can_create_projects': False,
            'can_edit_projects': False,
            'can_delete_projects': False,
            # PHASES
            'can_view_phases': False,
            'can_create_phases': False,
            'can_edit_phases': False,
            'can_delete_phases': False,
            # TASKS
            'can_view_all_tasks': False, # FALSE MEANS USER CAN ONLY VIEW HIS/HER ASSIGNED TASKS
            'can_create_tasks': False,
            'can_edit_tasks': False,
            'can_delete_tasks': False,
            # USERS
            'can_view_users': False,
            'can_create_users': False,
            'can_edit_users': False,
            'can_delete_users': False,
            "can_edit_password": True,
            # POSTS
            'can_view_all_posts': False,
            'can_view_own_posts': True,
            'can_create_posts': True,
            'can_edit_posts': True,
            'can_delete_posts': False,
            # CLIENTS
            'can_view_clients': False,
            'can_create_clients': False,
            'can_edit_clients': False,
            'can_delete_clients': False,
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
            # PHASES
            'can_view_phases': False,
            'can_create_phases': False,
            'can_edit_phases': False,
            'can_delete_phases': False,
            # TASKS
            'can_view_all_tasks': False,
            'can_create_tasks': False,
            'can_edit_tasks': False,
            'can_delete_tasks': False,
            # USERS
            'can_create_users': False,
            'can_edit_users': False,
            'can_delete_users': False,
            "can_edit_password": False,
            # POSTS
            'can_view_all_posts': False,
            'can_view_own_posts': False,
            'can_create_posts': False,
            'can_edit_posts': False,
            'can_delete_posts': False,
            # CLIENTS
            'can_view_clients': False,
            'can_create_clients': False,
            'can_edit_clients': False,
            'can_delete_clients': False,
        })