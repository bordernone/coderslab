from django.urls import path
from .views import scoreboard, recentCompetitionUserScoreboard, overallUserScoreboard

urlpatterns = [
    path('', scoreboard, name='scoreboard'),
    path('competition/recent/', recentCompetitionUserScoreboard, name="recentcompetitionuserscoreboard"),
    path('overall/', overallUserScoreboard, name="overalluserscoreboard"),
]