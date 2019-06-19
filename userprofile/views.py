from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.conf import settings
import re

# Create your views here.
def userProfile(request, username):
    try:
        thisUser = User.objects.get(username=username)
    except:
        if settings.DEBUG:
            return HttpResponse('No such user')
        else:
            raise Http404
    
    return render(request, 'userprofile.html', {'user': thisUser})

def userProfileJson(request):
    if not request.user.is_authenticated:
        if settings.DEBUG:
            return JsonResponse({'error':'not logged in'})
        else:
            raise Http404
            
    username = request.user.username
    try:
        thisUser = User.objects.get(username=username)
    except:
        if settings.DEBUG:
            return JsonResponse({'error':'not logged in'})
        else:
            raise Http404
    
    userJson = {
        'first_name': thisUser.first_name,
        'last_name': thisUser.last_name,
        'profileImgUrl': thisUser.profile.profileImgUrl,
        'username': thisUser.username,
        'bio': thisUser.profile.bio,
        'location': thisUser.profile.location,
        'website':thisUser.profile.website,
        'school': thisUser.profile.school,
        'college': thisUser.profile.college,
        'work': thisUser.profile.work,
        'receiveImpEmail': thisUser.profile.receiveImpEmail,
        'socialLinkFacebook': thisUser.profile.socialLinkFacebook,
        'socialLinkLinkedIn': thisUser.profile.socialLinkLinkedIn,
        'socialLinkInsta': thisUser.profile.socialLinkInsta,
        'socialLinkTwitter': thisUser.profile.socialLinkTwitter,
    }

    return JsonResponse(userJson)