from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage
import re
from .utils import isUsernameValid, isEmailValid, isPasswordValid, cleanUsername, cleanEmail
from .tokens import account_activation_token

# register page
def registerView(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect('/practice/')
    return render(request, 'register.html')

# registration process
def registerUser(request):
    if request.method != 'POST':
        return JsonResponse({'error':'must be a post request', 'at':'method'}) if settings.DEBUG else JsonResponse({'error':'Something went wrong!', 'at':'method'})
    else:
        if not 'username' in request.POST or request.POST['username'] == '':
            return JsonResponse({'error':'Username is required', 'at':'username'})
        elif not 'email' in request.POST or request.POST['email'] == '':
            return JsonResponse({'error':'Email is required', 'at': 'email'})
        elif not 'password' in request.POST or request.POST['password'] == '':
            return JsonResponse({'error':'Password is required', 'at': 'password'})
        else:
            username = cleanUsername(request.POST['username']) #lowercase username
            email = cleanEmail(request.POST['email'])
            password = request.POST['password']

            # check if email exists but account is inactive
            if User.objects.filter(email=email).exists() == True:
                tempUser = User.objects.get(email=email)
                if tempUser.is_active == False:
                    current_site = get_current_site(request)
                    sendActivationEmail(current_site, tempUser)
                    return JsonResponse({'success':'Please check your email inbox for confirmation'})

            if not isUsernameValid(username) == True:
                return JsonResponse({'error': isUsernameValid(username), 'at': 'username'})
            elif not isEmailValid(email) == True:
                return JsonResponse({'error': isEmailValid(email), 'at':'email'})
            elif not isPasswordValid(password) == True:
                return JsonResponse({'error': isPasswordValid(password), 'at':'password'})
            else:
                newUser = User.objects.create_user(username=username, email=email, password=password, is_active=False)
                newUser.save()
                current_site = get_current_site(request)
                sendActivationEmail(current_site, newUser)
                return JsonResponse({'success':'Please check your email inbox for confirmation'})

def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
    else:
        return HttpResponse('Activation link is invalid!')

def sendActivationEmailAgain(request):
    if request.method != 'POST':
        if settings.DEBUG:
            return JsonResponse({"error": 'Must be a post request'})
        else:
            raise Http404
    else:
        if not 'email' in request.POST:
            if settings.DEBUG:
                return JsonResponse({'error': 'Email not passed'})
            else:
                raise Http404
        else:
            emailAddress = request.POST['email']
            if User.objects.filter(email=emailAddress).exists():
                thisUser = User.objects.get(email=emailAddress)
                if thisUser.is_active:
                    if settings.DEBUG:
                        return JsonResponse({'error':'User already active'})
                    else:
                        raise Http404
                else:
                    current_site = get_current_site(request)
                    sendActivationEmail(current_site, thisUser)
                    return JsonResponse({'success':'Please check your email inbox for confirmation'})

def sendActivationEmail(current_site, userObj):
    mail_subject = 'Activate Your CodersLab.io Account.'
    message = render_to_string('accountactivationtemplate.html', {
        'user': userObj,
        'domain': current_site.domain,
        'uid':urlsafe_base64_encode(force_bytes(userObj.pk)),
        'token':account_activation_token.make_token(userObj),
    })
    to_email = userObj.email
    email = EmailMessage(mail_subject, message, to=[to_email])
    email.content_subtype = 'html'
    email.send()