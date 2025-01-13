from django.contrib import admin
from .models import User, Client, Project, Phase, Task, Post, Vacation


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'username', 'role', 'email')
    list_filter = ('role',)
    search_fields = ('username', 'email', 'role')
    ordering = ('username',)



@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('client_id', 'name', 'nip', 'get_contact', 'get_address')
    search_fields = ('name', 'nip', 'contact_email')
    ordering = ('name',)

    def get_contact(self, obj):
        return f"{obj.contact_person}, {obj.contact_email}"
    get_contact.short_description = 'Contact'
    get_contact.admin_order_field = 'contact_email'

    def get_address(self, obj):
        return f"{obj.city}, {obj.postcode}, {obj.street}"
    get_address.short_description = 'Address'
    get_address.admin_order_field = 'city'


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('project_id', 'name', 'get_client', 'type', 'status', 'get_address')
    list_filter = ('type', 'status', 'city')
    search_fields = ('assigned_client__name', 'type', 'city')

    def get_client(self, obj):
        return obj.assigned_client.name
    get_client.short_description = 'Client'
    get_client.admin_order_field = 'assigned_client__name'

    def get_address(self, obj):
        return f"{obj.city}, {obj.postcode}, {obj.street}"
    get_address.short_description = 'Address'
    get_address.admin_order_field = 'city'


@admin.register(Phase)
class PhaseAdmin(admin.ModelAdmin):
    list_display = ('phase_id', 'get_project', 'name', 'type', 'status', 'start_date', 'end_date')
    list_filter = ('type', 'status', 'assigned_project__name')
    search_fields = ('name', 'assigned_project__name')

    def get_project(self, obj):
        return obj.assigned_project.name
    get_project.short_description = 'Project'
    get_project.admin_order_field = 'assigned_project__name'


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('task_id', 'name', 'get_project', 'get_employee', 'status', 'created_date', 'end_date', 'total_hours')
    list_filter = ('status', 'assigned_project__name', 'assigned_user__username')
    search_fields = ('name', 'assigned_project__name', 'assigned_user__username')
    ordering = ('assigned_user__username', 'created_date')

    def get_project(self, obj):
        return obj.assigned_project.name
    get_project.short_description = 'Project'
    get_project.admin_order_field = 'assigned_project__name'

    def get_employee(self, obj):
        return obj.assigned_user.username
    get_employee.short_description = 'Employee'
    get_employee.admin_order_field = 'assigned_user__username'


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('post_id', 'get_task', 'post_date', 'work_hours', 'get_employee')
    list_filter = ('post_date', 'assigned_task__assigned_user__username', 'assigned_task__name', 'assigned_task__assigned_project__name')
    search_fields = ('assigned_task__name', 'assigned_task__assigned_user__username', 'assigned_task__assigned_project__name')
    ordering = ('assigned_task__assigned_user__username', 'post_date',)

    def get_employee(self, obj):
        return obj.assigned_task.assigned_user.username
    get_employee.short_description = 'Employee'
    get_employee.admin_order_field = 'assigned_task__assigned_user__username'

    def get_task(self, obj):
        return obj.assigned_task.name
    get_task.short_description = 'Task'
    get_task.admin_order_field = 'assigned_task__name'

@admin.register(Vacation)
class VacationAdmin(admin.ModelAdmin):
    list_display = ('vacation_id', 'get_employee', 'get_vacation_date', 'status')
    list_filter = ('vacation_date', 'assigned_user__username', 'status')
    search_fields = ('assigned_user__username', 'vacation_date')
    ordering = ('assigned_user__username', 'vacation_date',)

    def get_employee(self, obj):
        return obj.assigned_user.username
    get_employee.short_description = 'Employee'
    get_employee.admin_order_field = 'assigned_user__username'

    def get_vacation_date(self, obj):
        return f"{obj.vacation_date} ({obj.duration}h)"
    get_vacation_date.short_description = 'Vacation Date'
    get_vacation_date.admin_order_field = 'vacation_date'


