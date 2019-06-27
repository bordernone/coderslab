# homepage/urls.py
from django.urls import path
from .views import practiceView, submitSolution

urlpatterns = [
    path('', practiceView, name='practiceView'),
    path('submit/', submitSolution, name='submitsolution'),
]