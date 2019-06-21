from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .utils import isLocationValid, updateProfileLocation, isWebsiteValid, updateProfileWebsite, isSchoolValid, updateProfileSchool, isCollegeValid, updateProfileCollege, isWorkValid, updateProfileWork, isFirst_nameValid, updateProfileFirst_name, isLast_nameValid, updateProfileLast_name, isBioValid, updateProfileBio, isFacebookprofileurlValid, updateFacebookprofileurl, isLinkedinprofileurlValid, updateLinkedinprofileurl, isInstagramprofileurlValid, updateInstagramprofileurl, isTwitterprofileurlValid, updateTwitterprofileurl
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

    #updating first name
    if 'first_name' in request.POST:
        first_name = request.POST['first_name']
        if isFirst_nameValid(first_name) == True:
            updateProfileFirst_name(username, first_name)
        elif first_name == '':
            updateProfileFirst_name(username, first_name)
        else:
            return JsonResponse({'error':isFirst_nameValid(first_name), 'at': 'first_name'})

    #updating last name
    if 'last_name' in request.POST:
        last_name = request.POST['last_name']
        if isLast_nameValid(last_name) == True:
            updateProfileLast_name(username, last_name)
        elif last_name == '':
            updateProfileLast_name(username, last_name)
        else:
            return JsonResponse({'error':isLast_nameValid(last_name), 'at': 'last_name'})

    #updating bio
    if 'bio' in request.POST:
        bio = request.POST['bio']
        if isBioValid(bio) == True:
            updateProfileBio(username, bio)
        elif bio == '':
            updateProfileBio(username, bio)
        else:
            return JsonResponse({'error':isBioValid(bio), 'at': 'bio'})

    #updating facebookprofileurl
    if 'facebookprofileurl' in request.POST:
        facebookprofileurl = request.POST['facebookprofileurl']
        if isFacebookprofileurlValid(facebookprofileurl) == True:
            updateFacebookprofileurl(username, facebookprofileurl)
        elif facebookprofileurl == '':
            updateFacebookprofileurl(username, facebookprofileurl)
        else:
            return JsonResponse({'error':isFacebookprofileurlValid(facebookprofileurl), 'at': 'facebookprofileurl'})


    #updating linkedinprofileurl
    if 'linkedinprofileurl' in request.POST:
        linkedinprofileurl = request.POST['linkedinprofileurl']
        if isLinkedinprofileurlValid(linkedinprofileurl) == True:
            updateLinkedinprofileurl(username, linkedinprofileurl)
        elif linkedinprofileurl == '':
            updateLinkedinprofileurl(username, linkedinprofileurl)
        else:
            return JsonResponse({'error':isLinkedinprofileurlValid(linkedinprofileurl), 'at': 'linkedinprofileurl'})


    #updating instagramprofileurl
    if 'instagramprofileurl' in request.POST:
        instagramprofileurl = request.POST['instagramprofileurl']
        if isInstagramprofileurlValid(instagramprofileurl) == True:
            updateInstagramprofileurl(username, instagramprofileurl)
        elif instagramprofileurl == '':
            updateInstagramprofileurl(username, instagramprofileurl)
        else:
            return JsonResponse({'error':isInstagramprofileurlValid(instagramprofileurl), 'at': 'instagramprofileurl'})


    #updating twitterprofileurl
    if 'twitterprofileurl' in request.POST:
        twitterprofileurl = request.POST['twitterprofileurl']
        if isTwitterprofileurlValid(twitterprofileurl) == True:
            updateTwitterprofileurl(username, twitterprofileurl)
        elif twitterprofileurl == '':
            updateTwitterprofileurl(username, twitterprofileurl)
        else:
            return JsonResponse({'error':isTwitterprofileurlValid(twitterprofileurl), 'at': 'twitterprofileurl'})

    return JsonResponse({'success':True})