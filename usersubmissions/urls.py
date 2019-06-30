from django.urls import path
from .views import userSubmissionsView, userSubmissionsJson

urlpatterns = [
    path('', userSubmissionsView, name='usersubmissionsview'),
    path('json/', userSubmissionsJson, name='usersubmissionsjson'),
]