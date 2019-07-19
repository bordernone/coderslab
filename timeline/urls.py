from django.urls import path
from .views import timelineView, nextRoundTime, competitionRoundTimelineDetailsJson

urlpatterns = [
    path('', timelineView, name='timeline'),
    path('nextround/datetime/', nextRoundTime, name="nextroundtime"),
    path('api/activeupcomingroundsdata/', competitionRoundTimelineDetailsJson, name='competitionRoundTimelineDetailsJson'),
]