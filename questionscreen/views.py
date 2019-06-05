from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render, redirect
import re

# Create your views here.
def questionscreen(request):
    return render(request, 'questionscreen.html')