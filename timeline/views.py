from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from .models import Competitions, Rounds
from datetime import date, datetime
import re

# Create your views here.
def timelineView(request):
    return render(request, 'timeline.html')

def nextRoundTime(request):
    today = date.today()
    allRounds = Rounds.objects.filter(startdatetime__gt=today)
    nextRoundStartdatetime = allRounds[0].startdatetime
    
    # convert into milliseconds
    millisec = int(nextRoundStartdatetime.timestamp() * 1000)
    return JsonResponse({'datetime':millisec})