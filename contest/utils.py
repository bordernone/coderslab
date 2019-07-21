from .models import Rounds, Competitions, RoundQuestions, RoundSubmissions
from django.contrib.auth.models import User
from datetime import date, datetime, timedelta
from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings


def getActiveRoundId():
    today = timezone.now()
    allNextRounds = Rounds.objects.filter(startdatetime__lte=today).order_by('startdatetime').reverse()
    mostRecentRound = allNextRounds[0]
    enddatetime = allNextRounds[0].startdatetime + allNextRounds[0].duration
    if enddatetime >= today:
        return 'Active'
    else:
        return 'Not active'
    return mostRecentRound

def isRoundActive(id):
    today = timezone.now()
    thisRound = Rounds.objects.get(id=id)
    startdatetime = thisRound.startdatetime
    enddatetime = startdatetime + thisRound.duration
    if startdatetime <= today and enddatetime >= today:
        return True
    else:
        return False

def isRoundOver(id):
    today = timezone.now()
    thisRound = Rounds.objects.get(id=id)
    enddatetime = thisRound.startdatetime + thisRound.duration
    if enddatetime > today:
        return True
    else:
        return False

def getRoundnameFromId(id):
    return Rounds.objects.get(id=id).roundName

def getContestnameFromId(id):
    return Competitions.objects.get(id=id).competitionName

def getUserObjFromUsername(username):
    return User.objects.get(username=username)

def getQuestionObjFromId(id):
    question = None
    try:
        question = RoundQuestions.objects.get(id=id)
    except:
        return None
    return question

def contestQuestionSuccessRate(id):
    question = getQuestionObjFromId(id)
    totalSubmissions = RoundSubmissions.objects.filter(roundquestion=question).count()
    totalSuccessfulSubmissions = RoundSubmissions.objects.filter(roundquestion=question, passed=True).count()
    if totalSuccessfulSubmissions > 0:
        return int((totalSuccessfulSubmissions/totalSubmissions)*100)
    else:
        return 0

def contestUserMaxScore(username, questionid):
    user = getUserObjFromUsername(username)
    question = getQuestionObjFromId(questionid)
    if RoundSubmissions.objects.filter(user=user, roundquestion=question, passed=True).count() > 0:
        maxScore = RoundSubmissions.objects.filter(user=user, roundquestion=question, passed=True).order_by('-score')[0].score
    else:
        maxScore = 0
    return maxScore

def contestTotalUserSubmissions(username, questionid):
    user = getUserObjFromUsername(username)
    question = getQuestionObjFromId(questionid)
    return RoundSubmissions.objects.filter(user=user, roundquestion=question).count()

def sendSMSToAdmin(mobilenumbers, subject, message):
    fromEmail = settings.EMAIL_HOST_USER
    toEmail = list(map(lambda number: str(number) + '@sms.ncell.com.np', mobilenumbers))
    send_mail(
        subject,
        message,
        fromEmail,
        toEmail,
        fail_silently=False,
    )

def sendEmailToAdmin(emailAddresses, subject, message):
    fromEmail = settings.EMAIL_HOST_USER
    toEmail = emailAddresses
    send_mail(
        subject,
        message,
        fromEmail,
        toEmail,
        fail_silently=False,
    )

def getRoundObjFromQuestionId(questionid):
    return RoundQuestions.objects.get(id=questionid).thisround