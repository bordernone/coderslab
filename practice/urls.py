# homepage/urls.py
from django.urls import path
from .views import practice

urlpatterns = [
    path('', practice, name='practice'),
]