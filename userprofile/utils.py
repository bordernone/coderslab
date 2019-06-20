from django.contrib.auth.models import User
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