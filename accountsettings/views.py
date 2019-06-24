from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
import re

@login_required
def accountSettings(request):
    return render(request, 'accountsettings.html')