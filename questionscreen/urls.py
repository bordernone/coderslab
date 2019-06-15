# questionscreen/urls.py
from django.urls import path
from .views import questionscreen

urlpatterns = [
    path('<slug:titleslug>/<int:id>/', questionscreen, name='questionscreen'),
]