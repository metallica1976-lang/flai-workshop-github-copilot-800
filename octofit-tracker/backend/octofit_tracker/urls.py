"""octofit_tracker URL Configuration"""
import os
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .views import UserViewSet, TeamViewSet, ActivityViewSet, LeaderboardViewSet, WorkoutViewSet

codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'leaderboard', LeaderboardViewSet)
router.register(r'workouts', WorkoutViewSet)


@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'OctoFit Tracker API',
        'base_url': base_url,
        'endpoints': {
            'users': f'{base_url}/api/users/',
            'teams': f'{base_url}/api/teams/',
            'activities': f'{base_url}/api/activities/',
            'leaderboard': f'{base_url}/api/leaderboard/',
            'workouts': f'{base_url}/api/workouts/',
        }
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='root'),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
