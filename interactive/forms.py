from django import forms

class MovieForm(forms.Form):
	movie = forms.CharField(label='Movie', max_length=250)