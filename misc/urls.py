from django.urls import path
from .views import subscribe, privacyPolicyView, socialFbPage, socialInstagramPage, socialLinkedinPage, socialTwitterPage, termsandConditionView, showAnnouncementHtml

urlpatterns = [
    path('subscribe/', subscribe, name='subscribe'),
    path('privacy-policy/', privacyPolicyView, name='privacypolicyview'),
    path('terms-and-conditions/', termsandConditionView, name='termsandconditionsview'),
    path('fbpage/', socialFbPage, name='socialfbpage'),
    path('linkedinpage/', socialLinkedinPage, name='sociallinkedinpage'),
    path('instagrampage/', socialInstagramPage, name='socialinstagrampage'),
    path('twitterpage/', socialTwitterPage, name='socialtwitterpage'),
    path('announcement/', showAnnouncementHtml, name="showAnnouncementView"),
]