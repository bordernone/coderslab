from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.core.mail import send_mail
import re

# Create your views here.
def contactPage(request):
    return render(request, 'contactpage.html')

def sendContactMsg(request):
    if request.method != 'POST':
        if settings.DEBUG:
            return JsonResponse({'error':'must be a post request'})
        else:
            raise Http404
    
    if 'full_name' not in request.POST or request.POST['full_name'] == '':
        return JsonResponse({'error':'Full name is required', 'at':'full_name'})

    if 'email' not in request.POST or request.POST['email'] == '':
        return JsonResponse({'error':'Email is required', 'at': 'email'})

    if 'subject' not in request.POST or request.POST['subject'] == '':
        return JsonResponse({'error':'Subject is required', 'at': 'subject'})
    
    if 'message' not in request.POST or request.POST['message'] == '':
        return JsonResponse({'error':'Message is required', 'at':'message'})
    
    fullname = request.POST['full_name']
    email = request.POST['email']
    subject = request.POST['subject']
    message = 'Message: ' + request.POST['message']

    # check email validity
    try:
        validate_email(email)
        emailIsValid = True
    except ValidationError as e:
        return JsonResponse({'error':'Invalid email', 'at': 'email'})

    msgToMail = 'Sender: ' + fullname + '\n' + 'Email: ' + email + '\n' + 'Subject: ' + subject + '\n' + 'Message: ' + message

    send_mail(
        'CodersLab: New Contact Message',
        msgToMail, 
        email,
        ['coderslabio@gmail.com'],
        fail_silently=False
    )

    return JsonResponse({'success':True})