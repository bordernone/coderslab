from django.db import models

# Create your models here.
class Questions(models.Model):
    # django automatically adds a primary key field called id
    title = models.CharField(max_length = 200)
    content = models.TextField()
    points = models.IntegerField()
    subscore = models.IntegerField()
    CATEGORIES = (
        ('MATH', 'Mathematics'),
        ('ALGO', 'Algorithms'),
        ('1A', 'Round 1A'),
    )
    category = models.CharField(max_length=20, choices=CATEGORIES)


    def __str__(self):
        return '%s' % self.title
