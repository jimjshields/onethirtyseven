from django.http import HttpResponse
from django.template import RequestContext, loader, Context
from django.shortcuts import render, render_to_response
from forms import MovieForm, MoviesForm
from movieFilter import movieFilter2, multipleMovieFilter, movieTicketsJson, BOMWeeklyJson

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

def multiple_movie_page(request):
	if request.method == 'POST':
		form = MoviesForm(request.POST)
		if form.is_valid():
			data = form.cleaned_data
			chart_data = multipleMovieFilter([data['movie1'], data['movie2']])
			return render(request, 'interactive/multiple_movie_page.html', {'js_data': chart_data[0], 'movie_tags': chart_data[1], 'movies': [data['movie1'], data['movie2']]})
	else:
		form = MoviesForm()
	return render(request, 'interactive/multiple_movie_page.html', {'form': form})

def imdb_top_250_track(request):
	return render_to_response('interactive/imdb_top_250_track.html')

def base_template(request):
	return render_to_response('interactive/base_template.html')

def movie_tickets_page(request):
	chart_data = movieTicketsJson()
	return render(request, 'interactive/movie_tickets_page.html', {'js_data': chart_data})

def weekly_page(request):
	chart_data = BOMWeeklyJson()
	return render(request, 'interactive/weekly_page.html', {'js_data': chart_data})