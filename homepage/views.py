from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render, redirect
import re
from notifications.signals import notify
from django.contrib.auth.models import User


# Create your views here.
def homepage(request):
    return render(request, 'homepage.html')