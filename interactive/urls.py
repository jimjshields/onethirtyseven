from django.conf.urls import patterns, url

from interactive import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_137to1.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', views.index, name='index'),
    url(r'^movie_page/', views.movie_page, name='movie_page'),
    url(r'^base_template/', views.base_template, name='base_template'),
    
)