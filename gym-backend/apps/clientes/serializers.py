from rest_framework import serializers
from .models import Cliente, Configuracion
from datetime import date
from dateutil.relativedelta import relativedelta


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model            = Cliente
        fields           = '__all__'
        read_only_fields = ['fecha_vencimiento', 'estado']

    def _calcular_estado(self, fecha_vencimiento: date) -> str:
        dias = (fecha_vencimiento - date.today()).days
        if dias < 0:
            return 'vencido'
        elif dias <= 5:
            return 'por_vencer'
        return 'activo'

    def create(self, validated_data):
        base              = validated_data.get('fecha_inscripcion', date.today())
        duracion          = validated_data['duracion_meses']
        fecha_vencimiento = base + relativedelta(months=duracion)

        validated_data['fecha_vencimiento'] = fecha_vencimiento
        validated_data['estado']            = self._calcular_estado(fecha_vencimiento)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Si cambia duración o fecha de inscripción, recalcula vencimiento
        if 'duracion_meses' in validated_data or 'fecha_inscripcion' in validated_data:
            base     = validated_data.get('fecha_inscripcion', instance.fecha_inscripcion)
            duracion = validated_data.get('duracion_meses',    instance.duracion_meses)
            fecha_vencimiento = base + relativedelta(months=duracion)

            validated_data['fecha_vencimiento'] = fecha_vencimiento
            validated_data['estado']            = self._calcular_estado(fecha_vencimiento)
        return super().update(instance, validated_data)


class ConfiguracionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Configuracion
        fields = ['nombre_gimnasio', 'dias_aviso_previo']