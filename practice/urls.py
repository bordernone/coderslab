# homepage/urls.py
from django.urls import path
from .views import practiceView

urlpatterns = [
    path('', practiceView, name='practiceView'),
]