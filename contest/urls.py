from django.urls import path
from .views import contestView, submitSolution

urlpatterns = [
    path('<slug:competitionnameslug>/<int:contestid>/<slug:roundnameslug>/<int:roundid>/', contestView, name='contestview'),
    path('submit/', submitSolution, name='submitsolution'),
]