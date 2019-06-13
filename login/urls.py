from django.urls import path
from .views import loginPage, googleLogin, facebookLogin, loginUser

urlpatterns = [
    path('', loginPage, name='login'),
    path('native/', loginUser, name='loginuser'),
    path('google/', googleLogin, name="googlelogin"),
    path('facebook/', facebookLogin, name="facebooklogin"),
]