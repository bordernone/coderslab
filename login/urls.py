from django.urls import path
from django.conf.urls import url
from .views import loginPage, googleLogin, facebookLogin, loginUser
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', loginPage, name='login'),
    path('native/', loginUser, name='loginuser'),
    path('google/', googleLogin, name="googlelogin"),
    path('facebook/', facebookLogin, name="facebooklogin"),
    path('recover/', auth_views.PasswordResetView.as_view(template_name='accountrecover/recoveraccount.html', html_email_template_name='accountrecover/passwordresetemailtemplate.html'), name="password_reset"),
    path('recover/done/', auth_views.PasswordResetDoneView.as_view(template_name='accountrecover/done.html'), name='password_reset_done'),
    path('recover/complete/', auth_views.PasswordResetCompleteView.as_view(template_name='accountrecover/complete.html'), name='password_reset_complete'),
    url(r'^recover/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', auth_views.PasswordResetConfirmView.as_view(template_name='accountrecover/confirm.html'), name='password_reset_confirm'),
]