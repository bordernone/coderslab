from django.shortcuts import render
from django.http import Http404, HttpResponse, HttpResponseRedirect, JsonResponse
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.conf import settings
from .models import Subscriptions

# Create your views here.
def subscribe(request):
    if request.method != 'POST':
        if settings.DEBUG:
            return JsonResponse({'error':'must be a post request'})
        else:
            raise Http404
    else:
        if 'email' not in request.POST:
            if settings.DEBUG:
                return JsonResponse({'error':'no email provided', 'at':'email'})
            else:
                raise Http404
        else:
            email = request.POST['email']
            try:
                validate_email(email)
                isValid = True
            except ValidationError:
                isValid = False
            
            if isValid == True:
                if Subscriptions.objects.filter(email=email).exists():
                    return JsonResponse({'error':'Already Subscribed', 'at':'email'})
                else:
                    newSubscription = Subscriptions(email=email)
                    if 'first_name' in request.POST:
                        newSubscription.first_name = request.POST['first_name']
                    if 'last_name' in request.POST:
                        newSubscription.last_name = request.POST['last_name']
                    newSubscription.save()
                    return JsonResponse({'success':True})
            else:
                return JsonResponse({'error':'Invalid email', 'at':'email'})

def privacyPolicyView(request):
    return render(request, 'privacy-policy.html', {'pagetitle': 'Privacy Policy | CodersLab'})

def termsandConditionView(request):
    return render(request, 'terms-and-conditions.html', {'pagetitle': 'Terms & Conditions | CodersLab'})

def socialFbPage(request):
    return HttpResponseRedirect(settings.SOCIAL_FACEBOOK_PAGE_URL)

def socialLinkedinPage(request):
    return HttpResponseRedirect(settings.SOCIAL_LINKEDIN_URL)

def socialInstagramPage(request):
    return HttpResponseRedirect(settings.SOCIAL_INSTA_URL)

def socialTwitterPage(request):
    return HttpResponseRedirect(settings.SOCIAL_TWITTER_URL)