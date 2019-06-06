from django.urls import path
from .views import accountSettings

urlpatterns = [
    path('', accountSettings, name='accountsettings'),
]