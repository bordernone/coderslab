from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.core.serializers import serialize
from timeline.models import Rounds, RoundSubmissions
from datetime import date
from .utils import userObjFromId
import re

# Create your views here.
def scoreboard(request):
    return render(request, 'scoreboard.html')

def recentCompetitionUserScoreboard(request):
    today = date.today()
    allPastRounds = Rounds.objects.filter(startdatetime__lt=today).reverse()
    if allPastRounds.count() > 0:
        mostRecentRound = allPastRounds[0]
        top20Users = RoundSubmissions.objects.filter(roundquestion__thisround__id=mostRecentRound.id).order_by('-score', 'submitted_at')
        users = []
        for user in top20Users:
            users.append(userObjFromId(user.user_id))
        
        competitionUsers = []
        for user in users:
            competitionUsers.append({
                'userid': user.id,
                'profileImgUrl': user.profile.profileImgUrl,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'username': user.username,
            })
            
        return JsonResponse({'users':competitionUsers})
    else:
        competitionUsers = None
        return JsonResponse({'error':'No competitions'})
