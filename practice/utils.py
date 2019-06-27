from .models import Questions
from questionscreen.models import Submissions
from contest.utils import getUserObjFromUsername

def getQuestionObjFromId(id):
    try:
        thisQuestion = Questions.objects.get(id=id)
    except:
        thisQuestion = None
    return thisQuestion

def practiceQuestionSuccessRate(id):
    question = getQuestionObjFromId(id)
    totalSubmissions = Submissions.objects.filter(question=question).count()
    totalSuccessfulSubmissions = Submissions.objects.filter(question=question, passed=True).count()
    if totalSuccessfulSubmissions > 0:
        return int((totalSuccessfulSubmissions/totalSubmissions) * 100)
    else:
        return 0
    
def practiceUserMaxScore(username, questionid):
    user = getUserObjFromUsername(username)
    question = getQuestionObjFromId(questionid)
    if Submissions.objects.filter(user=user, question=question, passed=True).count() > 0:
        maxScore = Submissions.objects.filter(user=user, question=question, passed=True).order_by('-score')[0].score
    else:
        maxScore = 0
    return maxScore

def practiceTotalUserSubmissions(username, questionid):
    user = getUserObjFromUsername(username)
    question = getQuestionObjFromId(questionid)
    return Submissions.objects.filter(user=user, question=question).count()