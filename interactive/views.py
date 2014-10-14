from django.http import HttpResponse
from django.template import RequestContext, loader, Context
from django.shortcuts import render, render_to_response
from forms import MovieForm
from movieFilter import movieFilter2

# Create your views here.

def index(request):
    return render_to_response('interactive/index.html')

def movie_page(request):
	if request.method == 'POST':
		form = MovieForm(request.POST)
		if form.is_valid():
			data = form.cleaned_data
			chart_data = movieFilter2(data['movie'])
			return render(request, 'interactive/movie_page.html', {'js_data': chart_data[0], 'movie_tag': chart_data[1], 'movie': data['movie']})
	else:
		form = MovieForm()
	return render(request, 'interactive/movie_page.html', {'form': form})

def base_template(request):
	return render_to_response('interactive/base_template.html')