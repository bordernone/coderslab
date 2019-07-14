from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.core.serializers import serialize
from contest.models import Rounds, RoundSubmissions
from questionscreen.models import Submissions
from datetime import date, datetime
from .utils import userObjFromId
import re
from avatar.utils import get_primary_avatar
from avatar.templatetags.avatar_tags import has_avatar
from operator import itemgetter

# Create your views here.
def scoreboard(request):
    today = datetime.now()
    allPastRounds = Rounds.objects.filter(startdatetime__lte=today).order_by('startdatetime').reverse()
    if allPastRounds.count() > 0:
        mostRecentRound = allPastRounds[0].roundName
    else:
        mostRecentRound = 'No Recent Contests'
    return render(request, 'scoreboard.html', {'roundname': mostRecentRound, 'pagetitle': 'Scoreboard | CodersLab'})

def recentCompetitionUserScoreboard(request):
    today = datetime.now()
    allPastRounds = Rounds.objects.filter(startdatetime__lte=today).order_by('startdatetime').reverse()
    if allPastRounds.count() > 0:
        mostRecentRound = allPastRounds[0]

        # now editing
        thisRoundSubmissions = RoundSubmissions.objects.filter(roundquestion__thisround__id=mostRecentRound.id, passed=True).order_by('-score', 'submitted_at')
        users = {}
        for submission in thisRoundSubmissions:
            thisUser = submission.user
            if thisUser.id not in users.keys():
                if has_avatar(thisUser) == True:
                    userAvatarUrl = get_primary_avatar(thisUser.username).get_absolute_url()
                elif thisUser.profile.profileImgUrl != '':
                    userAvatarUrl = thisUser.profile.profileImgUrl
                else:
                    userAvatarUrl = ''
                users[thisUser.id] = {
                        'userid': thisUser.id,
                        'profileImgUrl': userAvatarUrl,
                        'first_name': thisUser.first_name,
                        'last_name': thisUser.last_name,
                        'username': thisUser.username,
                    } 
                
        competitionUsers = list(users.values())

        # editing ends
        
            
        return JsonResponse({'users':competitionUsers})
    else:
        competitionUsers = None
        return JsonResponse({'error':'No competitions'})

def overallUserScoreboard(request):
    allsubmissions = Submissions.objects.all()
    users = []
    for submission in allsubmissions:
        score = 0
        isSuccess = submission.passed
        gotSubscore = submission.gotSubscore
        if isSuccess:
            score = submission.question.points
            if gotSubscore:
                score = score + submission.question.subscore
            
            username = submission.user.username
            if not any(d.get('username', None) == username for d in users):

                # user avatar
                thisUserObj = userObjFromId(submission.user.id)
                if has_avatar(thisUserObj) == True:
                    userAvatarUrl = get_primary_avatar(thisUserObj).get_absolute_url()
                elif thisUserObj.profile.profileImgUrl != '':
                    userAvatarUrl = thisUserObj.profile.profileImgUrl
                else:
                    userAvatarUrl = ''

                users.append({
                    'username': username,
                    'score':score,
                    'profileImgUrl': userAvatarUrl,
                    'first_name': submission.user.first_name,
                    'last_name': submission.user.last_name,
                })
            else:
                for index, item in enumerate(users):
                    if item['username'] == username:
                        score = score + item['score']

                        # user avatar
                        thisUserObj = userObjFromId(submission.user.id)
                        if has_avatar(thisUserObj) == True:
                            userAvatarUrl = get_primary_avatar(thisUserObj).get_absolute_url()
                        elif thisUserObj.profile.profileImgUrl != '':
                            userAvatarUrl = thisUserObj.profile.profileImgUrl
                        else:
                            userAvatarUrl = ''


                        users[index] = {
                            'username':username,
                            'score':score,
                            'profileImgUrl': userAvatarUrl,
                            'first_name': submission.user.first_name,
                            'last_name': submission.user.last_name,
                        }      

    if len(users) > 0:
        users = sorted(users, key=itemgetter('score'), reverse=True)
        return JsonResponse({'users':users})
    else:
        return JsonResponse({'error': 'No submissions'})