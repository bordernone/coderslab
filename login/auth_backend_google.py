from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User


class GoogleAuthBackend(ModelBackend):
    """Log in to Django without providing a password.

    """
    def authenticate(self, request, email=None, token=None):
        try:
            user = User.objects.get(email=email)
            if user.profile.googleTokenId == token:
                return user
            else:
                return None
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None