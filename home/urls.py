from django.conf.urls import patterns, url

from home import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_137to1.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', views.home, name='home'),
)