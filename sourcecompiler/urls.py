# homepage/urls.py
from django.urls import path
from .views import testNow

urlpatterns = [
    path('test/', testNow, name='testing'),
]