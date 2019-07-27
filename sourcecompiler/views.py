from django.shortcuts import render
from django.http import HttpResponse
from .utils import makeCompileReq, checkAllTasksStatus
from .models import Tasks
from questionscreen.models import Submissions
from contest.models import RoundSubmissions
import asyncio

# Create your views here.
def testNow(request):
    submission = Submissions.objects.get(id=1)
    makeCompileReq(submission, False)
    return HttpResponse('Done')

def checkNow(request):
    allUnfinishedTasks = Tasks.objects.filter(status='PENDING').order_by('last_checked', 'is_contest')

    # following variable stores all Tasks coroutines
    tasksToBeScheduled = []
    for thisTask in allUnfinishedTasks:
        isContest = thisTask.is_contest
        submissionid = thisTask.submissionid

        if isContest:
            submission = RoundSubmissions.objects.get(id=submissionid)
        else:
            submission = Submissions.objects.get(id=submissionid)
        token = thisTask.token
        base64Encoded = thisTask.base64_encoded

        tasksToBeScheduled.append({
            'submission':submission,
            'isContest':isContest,
            'token':token,
            'base64encoded':base64Encoded
        })
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(checkAllTasksStatus(tasksToBeScheduled))
    return HttpResponse('checking')