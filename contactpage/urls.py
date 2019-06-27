# homepage/urls.py
from django.urls import path
from .views import contactPage, sendContactMsg

urlpatterns = [
    path('', contactPage, name='contactpage'),
    path('send/', sendContactMsg, name='sendcontactmsg'),
]