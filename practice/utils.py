from .models import Questions

def getQuestionObjFromId(id):
    try:
        thisQuestion = Questions.objects.get(id=id)
    except:
        thisQuestion = None
    return thisQuestion