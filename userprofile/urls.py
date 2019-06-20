from django.urls import path
from .views import userProfile, userProfileJson, editProfileDetails

urlpatterns = [
    path('<username>/', userProfile, name='userProfile'),
    path('profile/json/', userProfileJson, name='userProfileJson'),
    path('profile/update/', editProfileDetails, name='editProfileDetails'),
]