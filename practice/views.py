from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .models import Questions
from questionscreen.models import Submissions
from .utils import getQuestionObjFromId, practiceQuestionSuccessRate
from contest.utils import getUserObjFromUsername, sendEmailToAdmin, sendSMSToAdmin
from sourcecompiler.utils import makeCompileReq
import re
from django.core import serializers

# Create your views here.
def practiceView(request):
    allQuestions = Questions.objects.filter(public=True)
    allCats = Questions.objects.filter(public=True).values_list('category', flat=True).distinct()
    catsName = []
    index = 0
    catQuestions = []
    for cats in allCats:
        thisCatQuestions = Questions.objects.filter(public=True, category=cats)

        # success rate for each questions
        questionSuccessRates = []
        for question in thisCatQuestions:
            successRate = practiceQuestionSuccessRate(question.id)
            questionSuccessRates.append(int(successRate))
        
        if thisCatQuestions.count() > 0:
            thisCatQuestions = zip(thisCatQuestions, questionSuccessRates)
            categoryName = Questions.objects.filter(category=cats)[0].get_category_display()
            catQuestions.append(thisCatQuestions)
            catsName.append(categoryName)
    
    categoryAndQuestions = zip(catsName, catQuestions)
    return render(request, 'practice.html', {'cat':categoryAndQuestions, 'pagetitle': 'Practice | CodersLab'})
    
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

        # make a compile request
        makeCompileReq(newSubmission, False)

        # Submission Made 
        # Send SMS and Email to admin
        messageToSend = 'By: ' + userObj.username
        sendSMSToAdmin(settings.ADMIN_MOBILE_NUMBERS, 'New Submission (Practice)', messageToSend)
        sendEmailToAdmin(settings.ADMIN_EMAIL_ADDRESSES, 'New Submission (Practice)', messageToSend)
        return JsonResponse({'success':True})
    else:
        if settings.DEBUG:
            return JsonResponse({'error':'Invalid question id'})
        else:
            raise Http404