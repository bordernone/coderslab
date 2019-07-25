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
    startdatetime = models.DateTimeField()
    duration = models.DurationField()

    def __str__(self):
        return self.roundName

class RoundQuestions(models.Model):
    # django automatically adds a primary key field called id
    thisround = models.ForeignKey(Rounds, on_delete=models.CASCADE)
    title = models.CharField(max_length = 200, default='')
    content = models.TextField(default='')
    stdin = models.TextField(default='')
    expected_output = models.TextField(default='')
    points = models.IntegerField(default=0)
    subscore = models.IntegerField(default=0)
    public = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % self.title


class RoundSubmissions(models.Model):
    roundquestion = models.ForeignKey(RoundQuestions, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField(blank=True)
    submitted_at = models.DateTimeField(auto_now=True)
    passed = models.BooleanField(blank=True)
    checked = models.BooleanField(default=False)
    gotSubscore = models.BooleanField(default=False)
    content = models.TextField(blank=True)
    programminglanguage = models.CharField(max_length=50)
    
    def __str__(self):
        return self.roundquestion.title + ' -> ' + self.user.username

class RoundUsers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    thisround = models.ForeignKey(Rounds, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username + ' -> ' + self.thisround.roundName