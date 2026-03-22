from rest_framework import serializers
from .models import Notificacion

class NotificacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()

    class Meta:
        model  = Notificacion
        fields = ['id', 'cliente', 'cliente_nombre', 'mensaje', 'tipo', 'fecha', 'leida']

    def get_cliente_nombre(self, obj):
        return f'{obj.cliente.nombres} {obj.cliente.apellidos}'