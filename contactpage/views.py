from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render, redirect
import re

# Create your views here.
def contactPage(request):
    return render(request, 'contactpage.html')