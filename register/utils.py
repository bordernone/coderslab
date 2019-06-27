from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def isUsernameValid(username):
    # check if username == 'profile' since it is being used as url
    if username.lower() == 'profile':
        return 'Please choose another username'
        
    #check if username exists
    username = username.lower()
    if User.objects.filter(username=username).exists():
        return 'This username is taken. Try another one'
    
    #validating username
    if len(username) < 5 or len(username) > 15:
        return 'Username must be between 5 and 15 characters inclusive.'
    
    for char in username:
        if ((char.isalnum()) or (char in ['_', '-'])):
            valid = True
        else:
            return 'Username contains invalid character(s).'
    
    return True
            
def isEmailValid(email):
    #check if email exists
    email = email.lower()
    if User.objects.filter(email=email).exists():
        return 'There is already an account with this email address'
    
    #validating email
    try:
        validate_email(email)
    except ValidationError:
        return 'Invalid Email'
    return True

def isPasswordValid(password):
	if len(password) > 20:
		return 'Password must be lesser than 20 characters long'
	elif len(password) < 5:
		return 'Password must be at least 5 characters long'
	else:
		return True

def cleanUsername(username):
    return username.lower()

def cleanEmail(email):
    return email.lower()