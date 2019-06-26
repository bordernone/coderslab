from django.shortcuts import render
from django.http import Http404, HttpRequest, HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.decorators import login_required
from .utils import getActiveRoundId, isRoundActive, getContestnameFromId, getRoundnameFromId, getUserObjFromUsername, getQuestionObjFromId, contestQuestionSuccessRate
from .models import Rounds, Competitions, RoundQuestions, RoundSubmissions
from django.conf import settings
from django.template.defaultfilters import slugify


def contestView(request, competitionnameslug, contestid, roundnameslug, roundid):
    if not (Competitions.objects.filter(id=contestid).exists() and Rounds.objects.filter(id=roundid).exists()):
        if settings.DEBUG:
            return HttpResponse('Does not exist')
        else:
            raise Http404
    
    competitionname = getContestnameFromId(contestid)
    roundname = getRoundnameFromId(roundid)

    if slugify(competitionname) != competitionnameslug or slugify(roundname) != roundnameslug:
        return HttpResponseRedirect('/contest/'+slugify(competitionname)+'/'+str(contestid)+'/'+slugify(roundname)+'/'+str(roundid)+'/')
    
    # verified contest and round
    questions = RoundQuestions.objects.filter(thisround__id=roundid)

    questionSuccessRates = []
    for question in questions:
        successRate = contestQuestionSuccessRate(question.id)
        questionSuccessRates.append(int(successRate))
    
    questions = zip(questions, questionSuccessRates)

    return render(request, 'contest.html', {'questions':questions, 'roundname':roundname, 'isActive':isRoundActive(roundid)})

@login_required
def submitSolution(request):
    if request.method != 'POST':
        if settings.DEBUG:
            return JsonResponse({'error':'Must be a post request'})
        else:
            raise Http404
    if not 'questionid' in request.POST or not 'solutioncode' in request.POST or 'programminglanguage' not in request.POST:
        if settings.DEBUG:
            return JsonResponse({'error':'Question id, solution, or language not sent'})
        else:
            raise Http404

    username = request.user.username
    questionId = request.POST['questionid']
    solutionCode = request.POST['solutioncode']
    programmingLang = request.POST['programminglanguage'].lower() #converting to lowercase

    # verify programming languages
    if programmingLang not in ['python', 'c++', 'java', 'javascript']:
        return JsonResponse({'error':'Unacceptable programming language'})

    if getQuestionObjFromId(questionId) != None:
        questionObj = getQuestionObjFromId(questionId)
        userObj = getUserObjFromUsername(username)
        newSubmission = RoundSubmissions(roundquestion=questionObj, user=userObj, passed=False, content=solutionCode, score=0, programminglanguage=programmingLang)
        newSubmission.save()
        return JsonResponse({'success':True})
    else:
        if settings.DEBUG:
            return JsonResponse({'error':'Invalid question id'})
        else:
            raise Http404