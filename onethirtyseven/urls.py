from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'home.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^interactive/', include('interactive.urls')),
    url(r'^about/', include('about.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
