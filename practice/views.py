from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render, redirect
import re

# Create your views here.
def practice(request):
    return render(request, 'practice.html')