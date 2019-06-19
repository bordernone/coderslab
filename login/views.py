from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from register.utils import isEmailValid, isUsernameValid, cleanEmail, cleanUsername
import re
import hmac
import hashlib
import logging
import requests as getRequests

logger = logging.getLogger(__name__)

# Create your views here.
def loginPage(request):
    return render(request, 'login.html')

def loginUser(request):
    if request.method != 'POST':
        return JsonResponse({'error':'must be a post request'}) if settings.DEBUG else JsonResponse({'error':'Something is not right. Try again in a moment'})
    else:
        if 'username' in request.POST:
            if request.POST['username'] == '':
                return JsonResponse({'error':'Enter username or email', 'at':'username'})
            username = cleanUsername(request.POST['username'])
        elif 'email' in request.POST:
            if request.POST['email'] == '':
                return JsonResponse({'error':'Enter username or email', 'at':'email'})
            email = cleanEmail(request.POST['email'])
            if User.objects.filter(email=email).exists():
                username = User.objects.get(email=email).username
            else:
                return JsonResponse({'error':'User does not exist', 'at':'email'})
        if 'password' not in request.POST or request.POST['password'] == '':
            return JsonResponse({'error':'Invalid password', 'at':'password'})
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success':True})
        else:
            return JsonResponse({'error':'Wrong password', 'at':'password'})


def googleLogin(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Not a post request'}) if settings.DEBUG else JsonResponse({'error':'Something went wrong! Take a coffee break while we fix it. '})
    else:
        if not 'idtoken' in request.POST or request.POST['idtoken'] == '':
            return JsonResponse({'error': 'Id_token not sent'}) if settings.DEBUG else JsonResponse({'error':'Something went wrong! Take a coffee break while we fix it.'})
        else:
            token = request.POST['idtoken']
            
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

                if 'email' not in idinfo:
                    return JsonResponse({'error':'Email is required'})
                else:
                    email = cleanEmail(idinfo['email'])

                    if 'given_name' in idinfo:
                        firstName = idinfo['given_name']
                    else:
                        firstName = ''
                    if 'family_name' in idinfo:
                        lastName = idinfo['family_name']
                    else:
                        lastName = ''
                    if 'picture' in idinfo:
                        imgurl = idinfo['picture']

                    # CHECK IF USER IS ALREADY REGISTERED
                    if User.objects.filter(email=email).exists():
                        thisUser = User.objects.get(email=email)
                        #user exists, add user bio if provided
                        
                        thisUser.first_name = firstName
                        thisUser.last_name = lastName
                        thisUser.profile.profileImgUrl = imgurl

                        username = thisUser.username
                        if thisUser.profile.googleTokenId != userid:
                            thisUser.profile.googleTokenId = userid

                        thisUser.save()

                        user = authenticate(email=email, token=userid)
                        if user is not None:
                            login(request, user)
                            return JsonResponse({'success':'logged in'})
                        else:
                            return JsonResponse({'error': 'Cannot verify user credentials'})
                    
                    else:
                        #user doesn't exist, create and login
                        username=firstName+lastName
                        
                        username = re.sub(r'\W+', '', username) # removing all non alphanumeric characters except '_'
                        
                        i = 0
                        while not (isUsernameValid(username) == True):
                            username = username + str(i)
                            i = i + 1
                        username = cleanUsername(username)
                        email = cleanEmail(email)
                        newUser = User.objects.create_user(username=username, email=email, is_active=False)
                        newUser.profile.googleTokenId = userid
                        newUser.first_name = firstName
                        newUser.last_name = lastName
                        newUser.profile.profileImgUrl = imgurl

                        newUser.is_active = True
                        newUser.save()

                        user = authenticate(email=email, token=userid)

                        if user is not None:
                            login(request, user)
                            return JsonResponse({'success':'User created and logged in'}) if settings.DEBUG else JsonResponse({'success':'logged in'})
                        else:
                            return JsonResponse({'error':'Something went wrong'})

            except ValueError:
                # Invalid token
                return HttpResponse(ValueError)

def facebookLogin(request):
    if not request.method == 'POST':
        return JsonResponse({'error':'must be a post request'}) if settings.DEBUG else JsonResponse({'error':'Something went wrong. Take a coffee break while we fix it.'})
    else:
        if 'accesstoken' not in request.POST:
            return JsonResponse({'error':'no access token passed'}) if settings.DEBUG else JsonResponse({'error':'Something went wrong. Take a coffee break while we fix it.'})
        
        userAccessToken = request.POST['accesstoken']

        payload = {'input_token': userAccessToken, 'access_token': settings.FACEBOOK_APP_ID + '|' + settings.FACEBOOK_APP_SECRET}
        apiResponse = getRequests.get('https://graph.facebook.com/debug_token', params=payload)

        apiResponseJson = apiResponse.json()
        if 'data' in apiResponseJson:
            responseDataJson = apiResponseJson['data']
            if 'user_id' not in responseDataJson or 'app_id' not in responseDataJson:
                return JsonResponse(responseDataJson) if settings.DEBUG else JsonResponse({'error':'Something went wrong. Take a coffee break while we fix it.'})
            if responseDataJson['app_id'] != settings.FACEBOOK_APP_ID:
                return JsonResponse({'error':'App id does not match'}) if settings.DEBUG else JsonResponse({'error':'Something went wrong. Please try again'})
            if responseDataJson['is_valid'] != True:
                return JsonResponse({'error':'Invalid token'}) if settings.DEBUG else JsonResponse({'error':'Something went wrong. Try again after some times'})
            
            # get profile information
            appsecret_proof = hmac.new(settings.FACEBOOK_APP_SECRET.encode('utf-8'), msg=(userAccessToken.encode('utf-8')), digestmod=hashlib.sha256).hexdigest()
            payload = {'access_token':userAccessToken, 'appsecret_proof':appsecret_proof, 'fields':'email, first_name, last_name, picture.type(large)'}
            profileRequest = getRequests.get('https://graph.facebook.com/me', params=payload)
            profileRequestRes = profileRequest.json()

            if 'error' in profileRequestRes:
                logger.error('FACEBOOK LOGIN ATTEMPT FAILED')
                logger.error(profileRequestRes)
                if settings.DEBUG:
                    return JsonResponse(profileRequestRes)
                raise Http404

            if not 'email' in profileRequestRes:
                return JsonResponse({'error':'Email must be present'})
            
            email = cleanEmail(profileRequestRes['email'])
            userid = responseDataJson['user_id']
            first_name = ''
            if 'first_name' in profileRequestRes:
                first_name = profileRequestRes['first_name']
            last_name = ''
            if 'last_name' in profileRequestRes:
                last_name = profileRequestRes['last_name']
            imgurl=''
            if 'picture' in profileRequestRes:
                imgurl = profileRequestRes['picture']['data']['url']
            
            # check if user exists
            if User.objects.filter(email=email).exists():
                thisUser = User.objects.get(email=email)
                
                thisUser.profile.facebookUserId = userid
                thisUser.first_name = first_name
                thisUser.last_name = last_name
                thisUser.profile.profileImgUrl = imgurl
                thisUser.save()

                user = authenticate(email=email, userid=userid)
                if user is not None:
                    login(request, user)
                    return JsonResponse({'success':'logged in'}) if settings.DEBUG else JsonResponse({'success':'logged in'})
                else:
                    return JsonResponse({'error':'Something went wrong'})
            else:
                #user doesn't exist, create and login
                username=first_name+last_name
                
                username = re.sub(r'\W+', '', username) # removing all non alphanumeric characters except '_'
                
                i = 0
                while not (isUsernameValid(username) == True):
                    username = username + str(i)
                    i = i + 1
                username = cleanUsername(username)
                email= cleanEmail(email)
                newUser = User.objects.create_user(username=username, email=email, is_active=False)
                newUser.profile.facebookUserId = userid
                newUser.first_name = first_name
                newUser.last_name = last_name
                newUser.profile.profileImgUrl = imgurl

                newUser.is_active = True
                newUser.save()

                user = authenticate(email=email, userid=userid)

                if user is not None:
                    login(request, user)
                    return JsonResponse({'success':'User created and logged in'}) if settings.DEBUG else JsonResponse({'success':'logged in'})
                else:
                    return JsonResponse({'error':'Something went wrong'}) 
        else:
            return JsonResponse(apiResponseJson) if settings.DEBUG else JsonResponse({'error':'Something went wrong.'})
    