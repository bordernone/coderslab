# Generated by Django 2.2.2 on 2019-06-12 05:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0003_auto_20190612_0356'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='firstName',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AddField(
            model_name='profile',
            name='lastName',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AddField(
            model_name='profile',
            name='profileImgUrl',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]
