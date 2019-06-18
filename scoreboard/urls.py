from django.urls import path
from .views import scoreboard, recentCompetitionUserScoreboard

urlpatterns = [
    path('', scoreboard, name='scoreboard'),
    path('competition/recent/', recentCompetitionUserScoreboard, name="recentcompetitionuserscoreboard"),
]