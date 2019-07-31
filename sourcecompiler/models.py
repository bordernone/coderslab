from django.db import models
from .utils import getUserObjFromSubmission
from questionscreen.models import Submissions
from contest.models import RoundSubmissions

# Create your models here.
class Tasks(models.Model):
    submissionid = models.IntegerField()
    is_contest = models.BooleanField(default=False)
    token = models.CharField(max_length=50)
    base64_encoded = models.BooleanField(default=True)
    STATUSES = (
        ('PENDING', 'Task Pending'),
        ('CORRECT', 'Right Answer'),
        ('WRONG', 'Wrong Answer'),
        ('RUNTIMEERROR', 'RUNTIME error'),
    )
    status = models.CharField(max_length=20, choices=STATUSES)
    last_checked = models.DateTimeField(auto_now=True)

    def __str__(self):
        try:
            return getUserObjFromSubmission(self.submissionid, self.is_contest).username
        except:
            return 'DoesNotExist'

    def submitted_at(self):
        try:
            if is_contest:
                return RoundSubmissions.objects.get(id=self.submissionid).submitted_at
            else:
                return Submissions.objects.get(id=self.submissionid).submitted_at
        except:
            return 'DoesNotExist'