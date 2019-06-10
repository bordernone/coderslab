from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
import re

# Create your views here.
def login(request):
    return render(request, 'login.html')

def googleLogin(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Not a post request'}) if settings.DEBUG else JsonResponse({'error':'Something went wrong! Take a coffee break while we fix it. '})
    else:
        if not 'idtoken' in request.POST or request.POST['idtoken'] == '':
            return JsonResponse({'error': 'Id_token not sent'}) if settings.DEBUG else JsonResponse({'error':'Something went wrong! Take a coffee break while we fix it.'})
        elif not 'email' in request.POST or request.POST['email'] == '':
            return JsonResponse({'error': 'Email is required'})
        else:
            email = request.POST['email']
            if 'fullname' in request.POST: fullname = request.POST['fullname']
            if 'imgurl' in request.POST: imgurl = request.POST['imgurl']
            
            #verify token
            CLIENT_ID = settings.GOOGLE_CLIENT_ID
            try:
                # Specify the CLIENT_ID of the app that accesses the backend:
                idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

                # Or, if multiple clients access the backend server:
                # idinfo = id_token.verify_oauth2_token(token, requests.Request())
                # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
                #     raise ValueError('Could not verify audience.')

                if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                    raise ValueError('Wrong issuer.')

                # If auth request is from a G Suite domain:
                # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
                #     raise ValueError('Wrong hosted domain.')

                # ID token is valid. Get the user's Google Account ID from the decoded token.
                userid = idinfo['sub']
                return HttpResponse(userid)
            except ValueError:
                # Invalid token
                return HttpResponse('Wrong')