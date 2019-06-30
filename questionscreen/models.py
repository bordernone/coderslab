from django.db import models
from django.contrib.auth.models import User
from practice.models import Questions


class Submissions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Questions, on_delete=models.CASCADE)
    passed = models.BooleanField(blank=True)
    checked = models.BooleanField(default=False)
    gotSubscore = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now=True)
    content = models.TextField(blank=True)
    programminglanguage = models.CharField(max_length=50, blank=True)
    score = models.IntegerField(blank=True)

    def __str__(self):
        return self.user.username + ' -> ' + self.question.title