from django.urls import path
from .views import timelineView

urlpatterns = [
    path('', timelineView, name='timeline'),
]