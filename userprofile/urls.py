from django.urls import path
from .views import userProfile, userProfileJson

urlpatterns = [
    path('<username>/', userProfile, name='userProfile'),
    path('profile/json/', userProfileJson, name='userProfileJson'),
]