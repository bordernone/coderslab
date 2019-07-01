from django.urls import path
from .views import subscribe, privacyPolicyView

urlpatterns = [
    path('subscribe/', subscribe, name='subscribe'),
    path('privacy-policy/', privacyPolicyView, name='privacypolicyview'),
]