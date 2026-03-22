from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from apps.clientes.models import Cliente
from .models import Notificacion
from .serializers import NotificacionSerializer


def generar_notificaciones():
    hoy    = timezone.now().date()
    config = _get_dias_aviso()

    for cliente in Cliente.objects.all():
        dias_restantes = (cliente.fecha_vencimiento - hoy).days

        # Calcular nuevo estado
        if dias_restantes < 0:
            nuevo_estado = 'vencido'
        elif dias_restantes <= config:
            nuevo_estado = 'por_vencer'
        else:
            nuevo_estado = 'activo'

        # Actualizar estado si cambió
        if cliente.estado != nuevo_estado:
            cliente.estado = nuevo_estado
            cliente.save()

        # Si el cliente está activo eliminar todas sus notificaciones
        if nuevo_estado == 'activo':
            Notificacion.objects.filter(cliente=cliente).delete()
            continue

        # Determinar tipo y mensaje
        if dias_restantes < 0:
            tipo    = 'vencido'
            mensaje = f'Mensualidad vencida desde el {cliente.fecha_vencimiento.strftime("%d/%m/%Y")} ({abs(dias_restantes)} días atrás)'
        else:
            tipo    = 'vencimiento_proximo'
            mensaje = f'La mensualidad vence en {dias_restantes} día{"s" if dias_restantes != 1 else ""} ({cliente.fecha_vencimiento.strftime("%d/%m/%Y")})'

        # ✅ Elimina notificaciones anteriores del mismo tipo para este cliente
        # y crea solo una actualizada — así siempre hay máximo 1 por cliente por tipo
        Notificacion.objects.filter(
            cliente=cliente,
            tipo=tipo
        ).delete()

        Notificacion.objects.create(
            cliente=cliente,
            tipo=tipo,
            mensaje=mensaje,
            fecha=hoy,
        )


def _get_dias_aviso() -> int:
    try:
        from apps.clientes.models import Configuracion
        return Configuracion.get_config().dias_aviso_previo
    except Exception:
        return 5


class NotificacionViewSet(viewsets.ModelViewSet):
    queryset           = Notificacion.objects.all()
    serializer_class   = NotificacionSerializer
    permission_classes = [IsAuthenticated]
    http_method_names  = ['get', 'patch', 'delete']

    def get_queryset(self):
        generar_notificaciones()
        return Notificacion.objects.all()

    def destroy(self, request, *args, **kwargs):
        notif = self.get_object()
        notif.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['patch'])
    def marcar_todas_leidas(self, request):
        Notificacion.objects.filter(leida=False).update(leida=True)
        return Response({'message': 'Todas marcadas como leídas'})

    @action(detail=True, methods=['patch'])
    def marcar_leida(self, request, pk=None):
        notif       = self.get_object()
        notif.leida = True
        notif.save()
        return Response(NotificacionSerializer(notif).data)

    @action(detail=False, methods=['delete'])
    def eliminar_leidas(self, request):
        eliminadas, _ = Notificacion.objects.filter(leida=True).delete()
        return Response({'eliminadas': eliminadas})