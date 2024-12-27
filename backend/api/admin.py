from django.contrib import admin
from .models import Project, User, Task

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'status', 'created', 'modified')
    search_fields = ('name', 'comments')
    list_filter = ('status', 'created', 'modified')
    readonly_fields = ('created', 'modified')

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'role', 'profile_picture')
    search_fields = ('username', 'role')
    list_filter = ('role',)
    readonly_fields = ('last_login',)

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'assigned_user', 'start_date', 'end_date', 'author', 'created_date', 'modified_date')
    search_fields = ('name', 'description', 'assigned_user__username', 'author__username')
    list_filter = ('status', 'assigned_user', 'start_date', 'end_date')
    readonly_fields = ('created_date', 'modified_date')
