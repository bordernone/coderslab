from django.http import Http404, HttpRequest, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import logout
from django.conf import settings

def logoutUser(request):
    googleclientid = settings.GOOGLE_CLIENT_ID
    logout(request)
    return render(request, 'logout.html', {'googleclientid': googleclientid})