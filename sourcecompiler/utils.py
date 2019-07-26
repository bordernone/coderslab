from django.conf import settings
from questionscreen.models import Submissions
from contest.models import RoundSubmissions
import requests
import base64
import logging
import asyncio

logger = logging.getLogger(__name__)

def makeCompileReq(submission, iscontest):
    from .models import Tasks
    # these are url parameters
    # i acknowledge that booleans are set as string. Leave it this way. 
    waitForResponse = 'false' # check Judge0 API documentation. They do not allow waiting for response through their official API HOST
    base64Encoded = 'true' # send data in base64 or plain text? When true, base64 encode: stdin, expected_output, and source_code

    apiHostUrl = 'https://api.judge0.com/submissions/?base64_encoded='+base64Encoded+'&wait='+waitForResponse

    source_code = submission.content

    programmingLangDict = {
        'c++':10,
        'java':27,
        'javascript':29,
        'python':34,
    }

    if iscontest == True:
        question = submission.roundquestion
    else:
        question = submission.question
    
    stdin = question.stdin
    expected_output = question.expected_output
    programming_langid = programmingLangDict[submission.programminglanguage]

    # POST data
    if base64Encoded == 'true':
        post_data = {
            'source_code': base64.b64encode(source_code.encode('utf-8')),
            'language_id': programming_langid,
            'stdin': base64.b64encode(stdin.encode('utf-8')),
            'expected_output': base64.b64encode(expected_output.encode('utf-8')),
        }
    else:
        post_data = {
            'source_code': source_code,
            'language_id': 34,
            'stdin': stdin,
            'expected_output': expected_output,
        }

    print(post_data)

    try:
        response = requests.post(url=apiHostUrl, data=post_data)
        content = response.json()
        try:
            token = content['token']

            # save it to database
            if base64Encoded == 'true':
                temp = True
            else:
                temp = False
            newTask = Tasks(submissionid=submission.id, is_contest=iscontest, token=token, base64_encoded=temp, status='PENDING')
            newTask.save()
        except Exception as e:
            if settings.DEBUG:
                print(e)
                print(content)
            else:
                logger.error(e)
                logger.error(content)
    except Exception as e:
        if settings.DEBUG:
            print(e)
        else:
            logger.error(e)

async def checkAllTasksStatus(arrayOfTasksToBeScheduled):
    tasks = []
    for task in arrayOfTasksToBeScheduled:
        tasks.append(asyncio.create_task(checkCompileStatus(task['submission'], task['isContest'], task['token'], task['base64encoded'])))
    
    for task in tasks:
        await task

async def checkCompileStatus(submission, iscontest, token, base64Encoded):
    from .models import Tasks
    parameters = {
        'base64_encoded': str(base64Encoded).lower(),
    }
    apiResponseUrl = 'https://api.judge0.com/submissions/'+token

    apiResponse = await requests.get(url=apiResponseUrl, params=parameters)
    responsedata = apiResponse.json()
    print(responsedata)

def getUserObjFromSubmission(submissionid, iscontest):
    if iscontest:
        return RoundSubmissions.objects.get(id=submissionid).user
    else:
        return Submissions.objects.get(id=submissionid).user