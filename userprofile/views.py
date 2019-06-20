from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .utils import isLocationValid, updateProfileLocation, isWebsiteValid, updateProfileWebsite, isSchoolValid, updateProfileSchool, isCollegeValid, updateProfileCollege, isWorkValid, updateProfileWork
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

@login_required
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

@login_required
def editProfileDetails(request):
    if request.method != 'POST':
        if settings.DEBUG:
            return JsonResponse({'error':'Must be a post request'})
        else:
            raise Http404
    
    username = request.user.username

    itemsUpdated = 0
    #updating location
    if 'location' in request.POST:
        location = request.POST['location']
        if isLocationValid(location) == True:
            updateProfileLocation(username, location)
        elif location == '':
            updateProfileLocation(username, location)
        else:
            return JsonResponse({'error':isLocationValid(location), 'at': 'location'})

    #updating website
    if 'website' in request.POST:
        website = request.POST['website']
        if isWebsiteValid(website) == True:
            updateProfileWebsite(username, website)
        elif website == '':
            updateProfileWebsite(username, website)
        else:
            return JsonResponse({'error':isWebsiteValid(website), 'at': 'website'})

    #updating school
    if 'school' in request.POST:
        school = request.POST['school']
        if isSchoolValid(school) == True:
            updateProfileSchool(username, school)
        elif school == '':
            updateProfileSchool(username, school)
        else:
            return JsonResponse({'error':isSchoolValid(school), 'at': 'school'})

    #updating college
    if 'college' in request.POST:
        college = request.POST['college']
        if isCollegeValid(college) == True:
            updateProfileCollege(username, college)
        elif college == '':
            updateProfileCollege(username, college)
        else:
            return JsonResponse({'error':isCollegeValid(college), 'at': 'college'})
    
    #updating work
    if 'work' in request.POST:
        work = request.POST['work']
        if isWorkValid(work) == True:
            updateProfileWork(username, work)
        elif work == '':
            updateProfileWork(username, work)
        else:
            return JsonResponse({'error':isWorkValid(work), 'at': 'work'})

    return JsonResponse({'success':True})