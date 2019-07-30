from django.contrib.auth.models import User

def userObjFromId(id):
    try:
        thisUser = User.objects.get(id=id)
        return thisUser
    except:
        return None

# only pass ordered queryset in this function
def getDistinctModelFields(queryset, fields):
    noOfFields = len(fields)
    newqueryset = []
    usedFields = []
    for thisObj in queryset:
        temp = []
        for i in range(noOfFields):
            temp.append(getattr(thisObj, fields[i]))
        if temp in usedFields:
            pass
        else:
            usedFields.append(temp)
            newqueryset.append(thisObj)
    
    return newqueryset