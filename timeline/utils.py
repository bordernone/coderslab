from contest.models import Competitions, Rounds
from datetime import date, datetime
from django.utils import timezone
from django.db.models import F

today = timezone.now()

def getUpcomingRound():
    allRounds = Rounds.objects.filter(startdatetime__gt=today).order_by('startdatetime')
    if allRounds.count() > 0:
        return allRounds[0]
    else:
        return None

def getActiveRound():
    allRounds = Rounds.objects.filter(startdatetime__lte=today, startdatetime__gte=today - F('duration'))
    if allRounds.count() > 0:
        return allRounds[0]
    else:
        return None

def getContestFromRound(thisRound):
    return thisRound.competition