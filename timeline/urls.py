from django.urls import path
from .views import timelineView, nextRoundTime

urlpatterns = [
    path('', timelineView, name='timeline'),
    path('nextround/datetime/', nextRoundTime, name="nextroundtime"),
]