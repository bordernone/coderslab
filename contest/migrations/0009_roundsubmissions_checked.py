# Generated by Django 2.2.2 on 2019-06-30 09:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contest', '0008_auto_20190630_0903'),
    ]

    operations = [
        migrations.AddField(
            model_name='roundsubmissions',
            name='checked',
            field=models.BooleanField(default=False),
        ),
    ]
