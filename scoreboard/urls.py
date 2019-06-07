from django.urls import path
from .views import scoreboard

urlpatterns = [
    path('', scoreboard, name='scoreboard'),
]