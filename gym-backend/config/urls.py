from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/',         admin.site.urls),
    path('api/auth/',      include('apps.auth_app.urls')),
    path('api/clientes/',  include('apps.clientes.urls')),
    path('api/notif/',     include('apps.notificaciones.urls')),
]