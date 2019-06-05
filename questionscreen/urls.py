# questionscreen/urls.py
from django.urls import path
from .views import questionscreen

urlpatterns = [
    path('', questionscreen, name='questionscreen'),
]