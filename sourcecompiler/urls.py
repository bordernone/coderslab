# homepage/urls.py
from django.urls import path
from .views import testNow, checkNow

urlpatterns = [
    path('test/', testNow, name='testing'),
    path('check/', checkNow, name='checknow'),
]