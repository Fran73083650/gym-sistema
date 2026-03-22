from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ClienteViewSet, ConfiguracionView, config_publica

router = DefaultRouter()
router.register(r'', ClienteViewSet, basename='cliente')

urlpatterns = [
    path('config/',         ConfiguracionView.as_view(), name='configuracion'),
    path('config/publica/', config_publica,              name='config-publica'),
] + router.urls