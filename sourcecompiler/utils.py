from django.conf import settings
from questionscreen.models import Submissions
from contest.models import RoundSubmissions
import requests
import base64

def makeCompileReq(submission, iscontest):

    # these are url parameters
    waitForResponse = False # check Judge0 API documentation. They do not allow waiting for response through their official API HOST
    base64Encoded = True # send data in base64 or plain text? When true, base64 encode stdin, expected_output, source_code

    apiHostUrl = 'https://api.judge0.com/submissions/?base64_encoded=true&wait=false'

    source_code = submission.content

    if iscontest == True:
        question = submission.roundquestion
    else:
        question = submission.question
    
    stdin = question.stdin

    # POST data
    post_data = {
        'source_code': base64.b64encode(source_code.encode('utf-8')),
        'language_id': 34,
        'stdin': base64.b64encode(stdin.encode('utf-8')),
        'expected_output': base64.b64encode('apple'.encode('utf-8')),
    }
    response = requests.post(url=apiHostUrl, data=post_data)
    content = response.text
    print(content)