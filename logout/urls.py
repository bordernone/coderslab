from django.urls import path
from .views import logoutUser

urlpatterns = [
    path('', logoutUser, name='logoutuser'),
]