from django.http import HttpResponse
from django.template import RequestContext, loader, Context
from django.shortcuts import render, render_to_response

# Create your views here.

def about(request):
    return render_to_response('about/index.html')