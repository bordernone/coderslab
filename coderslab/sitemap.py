from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User
from contest.models import Competitions, Rounds

class StaticSitemap(Sitemap):
    priority =  0.5

    def items(self):
        return [
            'home',
            'login',
            'registerView',
            'password_reset',
            'scoreboard',
            'timeline',
            'privacypolicyview',
            'termsandconditionsview',
            'practiceView',
            'contactpage',
        ]
    
    def location(self, item):
        return reverse(item)

class UserProfileSitemap(Sitemap):
    def items(self):
        return User.objects.all().filter(is_active=True).order_by('username')
    
    def location(self, item):
        return reverse('userProfile', args=[item.username])

class ContestRoundsSitemap(Sitemap):
    priority = 0.5
    def items(self):
        return Rounds.objects.all()

    def location(self, item):
        return reverse('contestview', args=[slugify(item.competition.competitionName), item.competition.id, slugify(item.roundName), item.id])