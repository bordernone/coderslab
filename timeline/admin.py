from django.contrib import admin
from .models import Competitions, Rounds, RoundQuestions, RoundSubmissions


admin.site.register(Competitions)
admin.site.register(Rounds)
admin.site.register(RoundQuestions)
admin.site.register(RoundSubmissions)