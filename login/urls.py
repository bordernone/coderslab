from django.urls import path
from .views import login, googleLogin

urlpatterns = [
    path('', login, name='login'),
    path('google/', googleLogin, name="googlelogin"),
]