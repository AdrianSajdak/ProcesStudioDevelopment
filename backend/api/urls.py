from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('projects', ProjectViewset, basename='projects')
# router.register('users', UserViewset, basename='users')

urlpatterns = router.urls




# urlpatterns = [
#     path('', home),
# ]
