from django.urls import path
from .views import subscribe, privacyPolicyView, socialFbPage, socialInstagramPage, socialLinkedinPage, socialTwitterPage

urlpatterns = [
    path('subscribe/', subscribe, name='subscribe'),
    path('privacy-policy/', privacyPolicyView, name='privacypolicyview'),
    path('fbpage/', socialFbPage, name='socialfbpage'),
    path('linkedinpage/', socialLinkedinPage, name='sociallinkedinpage'),
    path('instagrampage/', socialInstagramPage, name='socialinstagrampage'),
    path('twitterpage/', socialTwitterPage, name='socialtwitterpage'),
]