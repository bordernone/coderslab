from django.db import models

# Create your models here.
class Subscriptions(models.Model):
    first_name = models.CharField(max_length=20, blank=True)
    last_name = models.CharField(max_length=20, blank=True)
    email = models.CharField(max_length=40, primary_key=True)

    def __str__(self):
        return self.email