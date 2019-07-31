from django.db import models

# Create your models here.
class Questions(models.Model):
    # django automatically adds a primary key field called id
    title = models.CharField(max_length = 200)
    content = models.TextField()
    stdin = models.TextField(default='')
    expected_output = models.TextField(default='')
    points = models.IntegerField()
    subscore = models.IntegerField()
    CATEGORIES = (
        ('MATH', 'Mathematics'),
        ('ALGO', 'Algorithms'),
        ('1A', 'Round 1A'),
    )
    category = models.CharField(max_length=20, choices=CATEGORIES)
    public = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % self.title
