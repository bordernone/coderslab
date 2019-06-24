from django.http import Http404, HttpRequest, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import logout

def logoutUser(request):
    logout(request)
    return render(request, 'logout.html')