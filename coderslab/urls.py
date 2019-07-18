"""coderslab URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from coderslab.sitemap import StaticSitemap, UserProfileSitemap, ContestRoundsSitemap
from django.contrib.sitemaps.views import sitemap
from django.conf.urls import url

sitemaps = {
 'static': StaticSitemap,
 'users': UserProfileSitemap,
 'contests': ContestRoundsSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('homepage.urls')), # homepage
    path('register/', include('register.urls')), # register
    path('login/', include('login.urls')), # login
    path('practice/', include('practice.urls')), # practice
    path('question/', include('questionscreen.urls')), #question screen
    path('user/', include('userprofile.urls')), #user profile
    path('account/', include('accountsettings.urls')), #account setting
    path('contact-us/', include('contactpage.urls')), #contact page
    path('scoreboard/', include('scoreboard.urls')), #scoreboard
    path('timeline/', include('timeline.urls')), #timeline
    path('avatar/', include('avatar.urls')), # avatar library 
    path('contest/', include('contest.urls')), #contest
    path('logout/', include('logout.urls')), #logout
    path('misc/', include('misc.urls')), #misc
    path('usersubmissions/', include('usersubmissions.urls')), #user submissions
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps},
     name='django.contrib.sitemaps.views.sitemap')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) #media files
