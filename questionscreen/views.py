from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.template.defaultfilters import slugify
from practice.models import Questions
from contest.models import RoundQuestions, RoundSubmissions
from contest.utils import contestQuestionSuccessRate, contestUserMaxScore, contestTotalUserSubmissions
from django.conf import settings
import re

# Create your views here.
def questionscreen(request, titleslug, id, iscontest=None):
    if iscontest != 1:
        iscontest = False
        try:
            question = Questions.objects.get(id=id)
        except:
            if settings.DEBUG:
                return HttpResponse('Wrong id')
            else:
                raise Http404
        
        if question.public == True:
            title = question.title
            if slugify(title) != titleslug:
                return HttpResponseRedirect('/question/'+slugify(title)+'/'+str(id)+'/')
            return render(request, 'questionscreen.html', {'question':question, 'iscontest':iscontest})
        else:
            # not ready for publication
            if settings.DEBUG:
                return HttpResponse('Not ready for publication')
            else:
                raise Http404
    else:
        iscontest = True
        try:
            question = RoundQuestions.objects.get(id=id)
        except:
            if settings.DEBUG:
                return HttpResponse('Wrong id')
            else:
                raise Http404
        
        if question.public == True:
            title = question.title
            if slugify(title) != titleslug:
                return HttpResponseRedirect('/question/'+slugify(title)+'/'+str(id)+'/1/')

            # get total submissions
            totalSubmissions = RoundSubmissions.objects.filter(roundquestion=question).count()
            successRate = contestQuestionSuccessRate(question.id)
            failureRate = 100-successRate
            if request.user.is_authenticated:
                username = request.user.username
                userMaxScore = contestUserMaxScore(username, question.id)
                totalUserSubmissions = contestTotalUserSubmissions(username, question.id)
            else:
                userMaxScore = 'N/A'
                totalUserSubmissions = 'N/A'

            return render(request, 'questionscreen.html', {'question':question, 'iscontest':iscontest, 'totalsubmissions':totalSubmissions, 'successrate':successRate, 'failurerate':failureRate, 'usermaxscore':userMaxScore, 'totalusersubmissions':totalUserSubmissions})
        else:
            # not ready for publication
            if settings.DEBUG:
                return HttpResponse('Not ready for publication')
            else:
                raise Http404