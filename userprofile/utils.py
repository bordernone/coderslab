from django.contrib.auth.models import User
from contest.models import RoundSubmissions
from contest.utils import getUserObjFromUsername
from questionscreen.models import Submissions
from scoreboard.utils import getDistinctModelFields
import re

def isLocationValid(location):
    if re.match("^[A-Za-z0-9][A-Za-z0-9_,. -]*[A-Za-z0-9]$", location):
        return True
    else:
        return 'Must be at least two characters. Allowed special characters are hyphen, underscore, dot, and comma'

def updateProfileLocation(username, location):
    thisUser = User.objects.get(username=username)
    thisUser.profile.location = location
    thisUser.save()

def isWebsiteValid(website):
    if re.match("^[A-Za-z0-9][A-za-z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$", website):
        return True
    else:
        return 'Invalid domain. Valid Eg: example.com'

def updateProfileWebsite(username, website):
    thisUser = User.objects.get(username=username)
    thisUser.profile.website = website
    thisUser.save()

def isSchoolValid(school):
    if re.match("^[A-Za-z0-9][A-Za-z0-9_,. -]*[A-Za-z0-9]$", school):
        return True
    else:
        return 'Min-length: 2 Chars. Allowed special characters:hyphen, underscore, dot, and comma'

def updateProfileSchool(username, school):
    thisUser = User.objects.get(username=username)
    thisUser.profile.school = school
    thisUser.save()

def isCollegeValid(college):
    if re.match("^[A-Za-z0-9][A-Za-z0-9_,. -]*[A-Za-z0-9]$", college):
        return True
    else:
        return 'Min-length: 2 Chars. Allowed special characters:hyphen, underscore, dot, and comma'

def updateProfileCollege(username, college):
    thisUser = User.objects.get(username=username)
    thisUser.profile.college = college
    thisUser.save()

def isWorkValid(work):
    if re.match("^[A-Za-z0-9][A-Za-z0-9_,. -]*[A-Za-z0-9]$", work):
        return True
    else:
        return 'Min-length: 2 Chars. Allowed special characters:hyphen, underscore, dot, and comma'

def updateProfileWork(username, work):
    thisUser = User.objects.get(username=username)
    thisUser.profile.work = work
    thisUser.save()

def isFirst_nameValid(first_name):
    if re.match("^[A-Za-z0-9][A-Za-z0-9_,. -]*[A-Za-z0-9]$", first_name):
        return True
    else:
        return 'Invalid Characters'

def updateProfileFirst_name(username, first_name):
    thisUser = User.objects.get(username=username)
    thisUser.first_name = first_name
    thisUser.save()

def isLast_nameValid(last_name):
    if re.match("^[A-Za-z0-9][A-Za-z0-9_,. -]*[A-Za-z0-9]$", last_name):
        return True
    else:
        return 'Invalid Characters'

def updateProfileLast_name(username, last_name):
    thisUser = User.objects.get(username=username)
    thisUser.last_name = last_name
    thisUser.save()

def isBioValid(bio):
    if re.match("^[A-Za-z0-9][A-Za-z0-9_,\. '-]*[A-Za-z0-9.*]$", bio):
        return True
    else:
        return 'Invalid Characters'

def updateProfileBio(username, bio):
    thisUser = User.objects.get(username=username)
    thisUser.profile.bio = bio
    thisUser.save()

def isFacebookprofileurlValid(facebookprofileurl):
    if re.match("^(http://|https://)((www\.facebook\.com)|(www\.fb\.com)|(facebook\.com)|(fb\.com))/.*$", facebookprofileurl):
        return True
    else:
        return 'Enter a valid url'

def updateFacebookprofileurl(username, facebookprofileurl):
    thisUser = User.objects.get(username=username)
    thisUser.profile.socialLinkFacebook = facebookprofileurl
    thisUser.save()

def isLinkedinprofileurlValid(linkedinprofileurl):
    if re.match("^(http://|https://)((.*\.linkedin\.com)|(linkedin\.com))/.*$", linkedinprofileurl):
        return True
    else:
        return 'Enter a valid url'

def updateLinkedinprofileurl(username, linkedinprofileurl):
    thisUser = User.objects.get(username=username)
    thisUser.profile.socialLinkLinkedIn = linkedinprofileurl
    thisUser.save()

def isInstagramprofileurlValid(instagramprofileurl):
    if re.match("^(http://|https://)((.*\.instagram\.com)|(instagram\.com))/.*$", instagramprofileurl):
        return True
    else:
        return 'Enter a valid url'

def updateInstagramprofileurl(username, instagramprofileurl):
    thisUser = User.objects.get(username=username)
    thisUser.profile.socialLinkInsta = instagramprofileurl
    thisUser.save()


def isTwitterprofileurlValid(twitterprofileurl):
    if re.match("^(http://|https://)((.*\.twitter\.com)|(twitter\.com))/.*$", twitterprofileurl):
        return True
    else:
        return 'Enter a valid url'

def updateTwitterprofileurl(username, twitterprofileurl):
    thisUser = User.objects.get(username=username)
    thisUser.profile.socialLinkTwitter = twitterprofileurl
    thisUser.save()

def updateUsername(username, newUsername):
    thisUser = User.objects.get(username=username)
    if username != newUsername:
        thisUser.username = newUsername
        thisUser.save()

def updatePassword(username, newPassword):
    thisUser = User.objects.get(username=username)
    thisUser.set_password(newPassword)
    thisUser.save()

def updateReceiveImpEmail(username, receiveImgEmail):
    thisUser = User.objects.get(username=username)
    thisUser.profile.receiveImpEmail = receiveImgEmail
    thisUser.save()

def userTotalScoreContest(username):
    user = getUserObjFromUsername(username)
    allSubmissionsOfThisUser = RoundSubmissions.objects.filter(user=user, passed=True).order_by('-score')
    allSubmissionsOfThisUser = getDistinctModelFields(allSubmissionsOfThisUser, ['user', 'roundquestion'])
    score = 0
    for submission in allSubmissionsOfThisUser:
        score = score + submission.score
    return score

def userTotalScorePractice(username):
    user = getUserObjFromUsername(username)
    allSubmissionsOfThisUser = Submissions.objects.filter(user=user, passed=True).order_by('-score')
    allSubmissionsOfThisUser = getDistinctModelFields(allSubmissionsOfThisUser, ['user', 'question'])
    score = 0
    for submission in allSubmissionsOfThisUser:
        score = score + submission.score
    return score