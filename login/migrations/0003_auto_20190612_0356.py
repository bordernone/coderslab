# Generated by Django 2.2.2 on 2019-06-12 03:56

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('login', '0002_userprofile_googletokenid'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UserProfile',
            new_name='Profile',
        ),
    ]
