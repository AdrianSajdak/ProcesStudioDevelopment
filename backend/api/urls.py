from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)
from .views import (
    RegisterView,
    UserViewSet,
    ProjectViewSet,
    PhaseViewSet,
    TaskViewSet,
    PostViewSet,
    ClientViewSet,
    CurrentUserView,
    VacationViewSet
)

router = DefaultRouter()
router.register('projects', ProjectViewSet, basename='projects')
router.register('tasks', TaskViewSet, basename='tasks')
router.register('phases', PhaseViewSet, basename='phases')
router.register('posts', PostViewSet, basename='posts')
router.register('clients', ClientViewSet, basename='clients')
router.register('users', UserViewSet, basename='users')
router.register('vacations', VacationViewSet, basename='vacations')

urlpatterns = [
    # REGISTER
    path('register/', RegisterView.as_view(), name='register'),
    # CURRENT USER
    path('users/me/', CurrentUserView.as_view(), name='current_user'),
    # JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += router.urls



