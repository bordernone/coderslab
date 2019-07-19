from contest.models import Competitions, Rounds
from datetime import date, datetime
from django.db.models import F
import pytz

utc=pytz.UTC
today = datetime.now()

def getUpcomingRound():
    today = datetime.now()
    allRounds = Rounds.objects.filter(startdatetime__gt=today).order_by('startdatetime')
    if allRounds.count() > 0:
        return allRounds[0]
    else:
        return None

def getActiveRound():
    allRounds = Rounds.objects.filter(startdatetime__lte=utc.localize(today), startdatetime__gte=utc.localize(today) - F('duration'))
    if allRounds.count() > 0:
        return allRounds[0]
    else:
        return None

def getContestFromRound(thisRound):
    return thisRound.competition