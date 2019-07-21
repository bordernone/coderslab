from django.contrib import admin
from .models import Competitions, Rounds, RoundQuestions, RoundSubmissions, RoundUsers
from django.utils.translation import gettext_lazy as _

admin.site.register(Competitions)
admin.site.register(Rounds)
admin.site.register(RoundQuestions)

# Submissions filter when round was active
class ActiveRoundSubmissions(admin.SimpleListFilter):
    title = _('Active Round Submissions')
    parameter_name = 'round'

    def lookups(self, request, model_admin):
        allRounds = Rounds.objects.all()
        return [(eachRound.id, eachRound.roundName) for eachRound in allRounds]
    
    def queryset(self, request, queryset):
        try:
            int(self.value())
            startdatetime = Rounds.objects.get(id=self.value()).startdatetime
            enddatetime = startdatetime + Rounds.objects.get(id=self.value()).duration
            temp = queryset.filter(submitted_at__gte=startdatetime, submitted_at__lte=enddatetime)
            return temp
        except Exception as e:
            print(e)

class SubmissionsRound(admin.ModelAdmin):
    list_filter = (ActiveRoundSubmissions,)

class UsersAndRound(admin.ModelAdmin):
    list_filter = ('thisround', 'user')

admin.site.register(RoundUsers, UsersAndRound)
admin.site.register(RoundSubmissions, SubmissionsRound)