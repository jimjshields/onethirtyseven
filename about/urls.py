from django.conf.urls import patterns, url

from about import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_137to1.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', views.about, name='about'),
)