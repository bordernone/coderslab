from django.urls import path
from .views import loginPage, googleLogin, facebookLogin

urlpatterns = [
    path('', loginPage, name='login'),
    path('google/', googleLogin, name="googlelogin"),
    path('facebook/', facebookLogin, name="facebooklogin"),
]