from django.conf.urls import url
from django.urls import path
from .views import registerView, registerUser, activate

urlpatterns = [
    path('', registerView, name='registerView'),
    path('user/', registerUser, name='registerUser'),
    path('activate/<uidb64>/<token>/',activate, name='activate'),
]