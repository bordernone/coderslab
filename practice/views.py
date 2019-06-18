from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from .models import Questions
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