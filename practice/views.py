from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Questions
from questionscreen.models import Submissions
from .utils import getQuestionObjFromId
from contest.utils import getUserObjFromUsername
import re
from django.core import serializers

# Create your views here.
def practiceView(request):
    allQuestions = Questions.objects.filter(public=True)
    allCats = Questions.objects.filter(public=True).values_list('category', flat=True).distinct()
    catsName = []
    for cats in allCats:
        catsName.append(Questions.objects.filter(category=cats)[0].get_category_display())
    return render(request, 'practice.html', {'cat':catsName, 'questions':allQuestions})

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
        newSubmission = Submissions(question=questionObj, user=userObj, passed=False, content=solutionCode, score=0, programminglanguage=programmingLang)
        newSubmission.save()
        return JsonResponse({'success':True})
    else:
        if settings.DEBUG:
            return JsonResponse({'error':'Invalid question id'})
        else:
            raise Http404