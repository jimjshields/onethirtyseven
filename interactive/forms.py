from django import forms

class MovieForm(forms.Form):
	movie = forms.CharField(label='Movie', max_length=250)

class MoviesForm(forms.Form):
	movie1 = forms.CharField(label='Movie1', max_length=250)
	movie2 = forms.CharField(label='Movie2', max_length=250)