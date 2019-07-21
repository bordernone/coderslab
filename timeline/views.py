from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from contest.models import Competitions, Rounds
from .utils import getUpcomingRound, getActiveRound, getContestFromRound

# Create your views here.
def timelineView(request):
    return render(request, 'timeline.html', {'pagetitle': 'Contest Timeline | CodersLab'})

def nextRoundTime(request):
    if getUpcomingRound() != None:
        nextRoundStartdatetime = getUpcomingRound().startdatetime
    else:
        return JsonResponse({'error':'No Upcoming Contest'})
    
    # convert into milliseconds
    millisec = int(nextRoundStartdatetime.timestamp() * 1000)
    return JsonResponse({'datetime':millisec})

def competitionRoundTimelineDetailsJson(request):
    activeRoundId = None
    if getActiveRound() == None:
        if getUpcomingRound() == None:
            return JsonResponse({'error':'No Upcoming Contest'})
        else:
            thisContest = getContestFromRound(getUpcomingRound())
    else:
        thisContest = getContestFromRound(getActiveRound())
        activeRoundId = getActiveRound().id

    allRoundsThisContest = Rounds.objects.filter(competition=thisContest)
    thisRounds = []
    for eachRound in allRoundsThisContest:
        if activeRoundId != None and activeRoundId == eachRound.id:
            thisRounds.append({
                'id':eachRound.id,
                'name':eachRound.roundName,
                'isActive': True
            })
        else:
            thisRounds.append({
                'id':eachRound.id,
                'name':eachRound.roundName,
                'isActive': False
            })

    jsonDataResponse = {'contest':{
        'id':thisContest.id,
        'name':thisContest.competitionName,
        'rounds':thisRounds,
    }}

    return JsonResponse(jsonDataResponse)