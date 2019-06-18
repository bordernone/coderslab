from django.contrib.auth.models import User

def userObjFromId(id):
    try:
        thisUser = User.objects.get(id=id)
        return thisUser
    except:
        return None