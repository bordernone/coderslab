# Generated by Django 2.2.2 on 2019-06-12 14:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0005_auto_20190612_0548'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='facebookUserId',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]