from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.template.defaultfilters import slugify
from practice.models import Questions
from django.conf import settings
import re

# Create your views here.
def questionscreen(request, titleslug, id):
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
        return render(request, 'questionscreen.html', {'question':question})
    else:
        # not ready for publication
        if settings.DEBUG:
            return HttpResponse('Not ready for publication')
        else:
            raise Http404