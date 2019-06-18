from django.db import models
from django.contrib.auth.models import User
from practice.models import Questions


class submissions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Questions, on_delete=models.CASCADE)
    success = models.BooleanField(default=False)
    gotSubscore = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username + ' -> ' + self.question.title