from django.conf import settings
from questionscreen.models import Submissions
from contest.models import RoundSubmissions
import requests
import base64
import logging
import asyncio
import aiohttp

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
    for task in arrayOfTasksToBeScheduled:
        async with aiohttp.ClientSession() as session:
            await checkCompileStatus(session, task['submission'], task['isContest'], task['token'], task['base64encoded'])

async def checkCompileStatus(session, submission, iscontest, token, base64Encoded):
    from .models import Tasks
    currentTask = Tasks.objects.get(submissionid=submission.id, token=token)
    apiResponseUrl = 'https://api.judge0.com/submissions/'+token#+'/?base64_encoded='+str(base64Encoded).lower()
    async with session.get(apiResponseUrl) as apiResponse:
        responsedata = await apiResponse.json()

        try:
            status = responsedata['status']

            if status == 500:
                if settings.DEBUG:
                    print(responsedata)
                else:
                    logger.error('Internal Server Error when checking task. Token: ' + token)
            else:
                try:
                    statusMsg = status['description']

                    if statusMsg == 'Accepted':
                        setTaskStatus(currentTask.id, 'CORRECT')
                        updateSubmissionStatus(submission.id, iscontest, 'CORRECT')
                    elif statusMsg == 'Wrong Answer':
                        setTaskStatus(currentTask.id, 'WRONG')
                        updateSubmissionStatus(submission.id, iscontest, 'WRONG')
                    elif 'Runtime Error' in statusMsg:
                        setTaskStatus(currentTask.id, 'RUNTIMEERROR')
                        updateSubmissionStatus(submission.id, iscontest, 'WRONG')
                        if settings.DEBUG:
                            print(responsedata)
                        else:
                            logger.error('2. Runtime Error: ' + token)
                    elif 'Compilation Error' in statusMsg:
                        setTaskStatus(currentTask.id, 'RUNTIMEERROR')
                        updateSubmissionStatus(submission.id, iscontest, 'WRONG')
                        if settings.DEBUG:
                            print(responsedata)
                        else:
                            logger.error('2. Compilation Error: ' + token)
                    else:
                        if settings.DEBUG:
                            print('No matching status: ' + statusMsg)
                            print(responsedata)
                        else:
                            logger.error('No matching status: ' + statusMsg)
                            logger.error(responsedata)
                except Exception as e:
                    if settings.DEBUG:
                        print('2. Cannot check task. Token: ' + token)
                        print(e)
                        print(responsedata)
                    else:
                        logger.error('2. Cannot check task. Token: ' + token)
        except Exception as e:
            if settings.DEBUG:
                print('1. Cannot check task. Token: ' + token)
                print(e)
                print(responsedata)
            else:
                logger.error('1. Cannot check task. Token: ' + token)

def setTaskStatus(taskid, msg):
    from .models import Tasks
    thisTask = Tasks.objects.get(id=taskid)
    thisTask.status = msg
    thisTask.save()

def updateSubmissionStatus(submissionid, iscontest, STATUS):
    if STATUS not in ['CORRECT', 'WRONG']:
        print('Status can only be CORRECT or WRONG')
    else:
        if STATUS == 'CORRECT':
            if iscontest:
                thisSubmission = RoundSubmissions.objects.get(id=submissionid)
                thisSubmission.passed = True
                thisSubmission.checked = True
                thisSubmission.score = thisSubmission.roundquestion.points + thisSubmission.roundquestion.subscore
                thisSubmission.gotSubscore = True
                thisSubmission.save()
            else:
                thisSubmission = Submissions.objects.get(id=submissionid)
                thisSubmission.passed = True
                thisSubmission.checked = True
                thisSubmission.gotSubscore = True
                thisSubmission.score = thisSubmission.question.points + thisSubmission.question.subscore
                thisSubmission.save()
        elif STATUS == 'WRONG':
            if iscontest:
                thisSubmission = RoundSubmissions.objects.get(id=submissionid)
                thisSubmission.passed = False
                thisSubmission.checked = True
                thisSubmission.score = 0
                thisSubmission.gotSubscore = False
                thisSubmission.save()
            else:
                thisSubmission = Submissions.objects.get(id=submissionid)
                thisSubmission.passed = False
                thisSubmission.checked = True
                thisSubmission.gotSubscore = False
                thisSubmission.score = 0
                thisSubmission.save()



def getUserObjFromSubmission(submissionid, iscontest):
    if iscontest:
        return RoundSubmissions.objects.get(id=submissionid).user
    else:
        return Submissions.objects.get(id=submissionid).user