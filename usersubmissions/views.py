from django.shortcuts import render
from django.http import Http404, HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.decorators import login_required
from questionscreen.models import Submissions
from contest.models import RoundSubmissions
from contest.utils import getUserObjFromUsername
from django.core import serializers

@login_required
def userSubmissionsView(request):
    if 'limit' in request.GET:
        try:
            limit = int(request.GET['limit'])
        except:
            limit = 20
    else:
        limit = 20

    if 'q' in request.GET and (request.GET['q'] == 'contest'):
        section = request.GET['q']
    else:
        section = 'practice'
        

    username = request.user.username
    currentUser = getUserObjFromUsername(username)
    if section == 'contest':
        allSubmissions = RoundSubmissions.objects.filter(user=currentUser).order_by('-submitted_at')[:limit]
    else:
        allSubmissions = Submissions.objects.filter(user=currentUser).order_by('-submitted_at')[:limit]

    return render(request, 'usersubmissions.html', {'submissions': allSubmissions, 'pagetitle' : 'Your Submissions | CodersLab'})

@login_required
def userSubmissionsJson(request):
    if 'limit' in request.GET:
        try:
            limit = int(request.GET['limit'])
        except:
            limit = 20
    else:
        limit = 20

    if 'q' in request.GET and (request.GET['q'] == 'contest'):
        section = request.GET['q']
    else:
        section = 'practice'
        

    username = request.user.username
    currentUser = getUserObjFromUsername(username)
    if section == 'contest':
        allSubmissions = RoundSubmissions.objects.filter(user=currentUser).order_by('-submitted_at')[:limit]
    else:
        allSubmissions = Submissions.objects.filter(user=currentUser).order_by('-submitted_at')[:limit]

    results = []
    for thisSubmission in allSubmissions:
        try:
            title = thisSubmission.roundquestion.title
        except:
            title = thisSubmission.question.title
        checked = thisSubmission.checked
        passed = thisSubmission.passed
        temp = {
            'title': title,
            'checked': checked,
            'passed': passed,
        }
        results.append(temp)
    
    return JsonResponse({'submissions': results})