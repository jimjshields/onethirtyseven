from django.conf.urls import patterns, url

from interactive import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_137to1.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', views.index, name='index'),
    url(r'^movie_page/', views.movie_page, name='movie_page'),
	url(r'^multiple_movie_page/', views.multiple_movie_page, name='multiple_movie_page'),
	url(r'^movie_tickets_page/', views.movie_tickets_page, name='movie_tickets_page'),
	# url(r'^weekly_page/', views.weekly_page, name='weekly_page'),
	url(r'^top_250_track/', views.top_250_track, name='top_250_track'),
    url(r'^base_template/', views.base_template, name='base_template'),
    
)