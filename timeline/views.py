from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from contest.models import Competitions, Rounds
from datetime import date, datetime
import re

# Create your views here.
def timelineView(request):
    return render(request, 'timeline.html')

def nextRoundTime(request):
    today = datetime.now()
    allRounds = Rounds.objects.filter(startdatetime__gt=today).order_by('startdatetime')
    nextRoundStartdatetime = allRounds[0].startdatetime
    
    # convert into milliseconds
    millisec = int(nextRoundStartdatetime.timestamp() * 1000)
    return JsonResponse({'datetime':millisec})