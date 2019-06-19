from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.core.serializers import serialize
from timeline.models import Rounds, RoundSubmissions
from questionscreen.models import Submissions
from datetime import date
from .utils import userObjFromId
import re
from operator import itemgetter

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

def overallUserScoreboard(request):
    allsubmissions = Submissions.objects.all()
    users = []
    for submission in allsubmissions:
        score = 0
        isSuccess = submission.success
        gotSubscore = submission.gotSubscore
        if isSuccess:
            score = submission.question.points
            if gotSubscore:
                score = score + submission.question.subscore
            
            username = submission.user.username
            if not any(d.get('username', None) == username for d in users):
                users.append({
                    'username': username,
                    'score':score,
                    'profileImgUrl': submission.user.profile.profileImgUrl,
                    'first_name': submission.user.first_name,
                    'last_name': submission.user.last_name,
                })
            else:
                for index, item in enumerate(users):
                    if item['username'] == username:
                        score = score + item['score']
                        users[index] = {
                            'username':username,
                            'score':score,
                            'profileImgUrl': submission.user.profile.profileImgUrl,
                            'first_name': submission.user.first_name,
                            'last_name': submission.user.last_name,
                        }      

    if len(users) > 0:
        users = sorted(users, key=itemgetter('score'), reverse=True)
        return JsonResponse({'users':users})
    else:
        return JsonResponse({'error': 'No submissions'})