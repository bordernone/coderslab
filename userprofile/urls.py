from django.urls import path
from .views import userProfile

urlpatterns = [
    path('', userProfile, name='userProfile'),
]