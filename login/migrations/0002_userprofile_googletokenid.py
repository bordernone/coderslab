# Generated by Django 2.2.2 on 2019-06-12 03:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='googleTokenId',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]
