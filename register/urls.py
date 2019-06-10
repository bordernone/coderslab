from django.conf.urls import url
from django.urls import path
from .views import registerView, registerUser, activate

urlpatterns = [
    path('', registerView, name='registerView'),
    path('user/', registerUser, name='registerUser'),
    url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',activate, name='activate'),
]