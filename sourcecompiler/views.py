from django.shortcuts import render
from django.http import HttpResponse
from .utils import makeCompileReq

# Create your views here.
def testNow(request):
    makeCompileReq()
    return HttpResponse('Done')