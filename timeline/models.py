from django.db import models
from django.contrib.auth.models import User
from practice.models import Questions

class Competitions(models.Model):
    competitionName = models.CharField(max_length=20)
    isActive = models.BooleanField()

    def __str__(self):
        return self.competitionName

class Rounds(models.Model):
    competition = models.ForeignKey(Competitions, on_delete=models.CASCADE)
    roundName = models.CharField(max_length=20)
    participantsCount = models.IntegerField()
    startdatetime = models.DateTimeField()
    duration = models.DurationField()

    def __str__(self):
        return self.roundName

class RoundQuestions(models.Model):
    thisround = models.ForeignKey(Rounds, on_delete=models.CASCADE)
    question = models.ForeignKey(Questions, on_delete=models.CASCADE)

    def __str__(self):
        return self.question.title

class RoundSubmissions(models.Model):
    roundquestion = models.ForeignKey(RoundQuestions, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField(blank=True)
    submitted_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.roundquestion.question.title + ' -> ' + self.user.username