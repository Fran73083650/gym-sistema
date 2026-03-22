from django.contrib import admin
from .models import Cliente, Configuracion

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display  = ['nombres', 'apellidos', 'celular', 'duracion_meses', 'fecha_vencimiento', 'estado']
    list_filter   = ['estado']
    search_fields = ['nombres', 'apellidos', 'celular']

@admin.register(Configuracion)
class ConfiguracionAdmin(admin.ModelAdmin):
    list_display = ['nombre_gimnasio', 'dias_aviso_previo']