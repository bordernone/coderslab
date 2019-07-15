"""
Django settings for coderslab project.

Generated by 'django-admin startproject' using Django 2.1.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os
from .email_login_credentials import EMAIL_ADDRESS, PASSWORD
from .auth_keys import GOOGLECLIENTID, FACEBOOKAPPID, FACEBOOKAPPSECRET

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'lvj*90^-nm=+%3r_os00h2rfr-d=gh(#-g3=v1f7yk^3bj!7w='

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['coderslab.io', 'www.coderslab.io']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'homepage.apps.HomepageConfig', #homepage
    'homepage.templatetags', # template tags
    'register.apps.RegisterConfig', #register
    'login.apps.LoginConfig', #login
    'practice.apps.PracticeConfig', #practice
    'questionscreen.apps.QuestionscreenConfig', #question screen
    'userprofile.apps.UserprofileConfig', #user profile
    'accountsettings.apps.AccountsettingsConfig', #account settings
    'contactpage.apps.ContactpageConfig', #contact page
    'scoreboard.apps.ScoreboardConfig', #score board
    'timeline.apps.TimelineConfig', #timeline
    'contest.apps.ContestConfig', #contest
    'logout.apps.LogoutConfig', #logout
    'misc.apps.MiscConfig', #misc
    'usersubmissions.apps.UsersubmissionsConfig', #user submissions
    'avatar', #avatar library
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'coderslab.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')], # templates directory
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.core.context_processors.request",
)

WSGI_APPLICATION = 'coderslab.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Auth Backend
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend', #default auth backend
    'login.auth_backend_google.GoogleAuthBackend', #google auth backend
    'login.auth_backend_facebook.FacebookAuthBackend', #facebook auth backend
)


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# login and register URL
LOGIN_URL = '/login/'

# Email
""" Gmail
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = EMAIL_ADDRESS
EMAIL_HOST_PASSWORD = PASSWORD
"""
#CODERSLAB SMTP
EMAIL_USE_TLS = False
EMAIL_HOST = 'mail.gomusix.net'
EMAIL_PORT = 26
EMAIL_HOST_USER = EMAIL_ADDRESS
EMAIL_HOST_PASSWORD = PASSWORD

# Social Sign in
GOOGLE_CLIENT_ID = GOOGLECLIENTID
FACEBOOK_APP_ID = FACEBOOKAPPID
FACEBOOK_APP_SECRET = FACEBOOKAPPSECRET

# Social Urls
SOCIAL_FACEBOOK_PAGE_URL = 'https://www.facebook.com/CodersLab-883282698685530'
SOCIAL_LINKEDIN_URL = ''
SOCIAL_INSTA_URL = ''
SOCIAL_TWITTER_URL = ''

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

MEDIA_URL = '/media/'
# Change STATIC root and Media root for deployment

# For development
"""# For development
MEDIA_ROOT = BASE_DIR + "/media"
"""

# For production
STATIC_ROOT = '/home/gomusixn/public_html/coderslab.io/static'
MEDIA_ROOT = '/home/gomusixn/public_html/coderslab.io/media'


#AVATAR
AVATAR_CHANGE_TEMPLATE = 'avatar_change.html'
AVATAR_DELETE_TEMPLATE = 'avatar_delete.html'
AVATAR_CLEANUP_DELETED = True