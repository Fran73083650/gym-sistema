from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from datetime import date
from .models import Cliente, Configuracion
from .serializers import ClienteSerializer, ConfiguracionSerializer
from apps.notificaciones.models import Notificacion


class ClienteViewSet(viewsets.ModelViewSet):
    queryset           = Cliente.objects.all()
    serializer_class   = ClienteSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        return Response({
            'total':      Cliente.objects.count(),
            'activos':    Cliente.objects.filter(estado='activo').count(),
            'por_vencer': Cliente.objects.filter(estado='por_vencer').count(),
            'vencidos':   Cliente.objects.filter(estado='vencido').count(),
        })

    @action(detail=True, methods=['post'])
    def renovar(self, request, pk=None):
        cliente  = self.get_object()
        duracion = int(request.data.get('duracion_meses', cliente.duracion_meses))

        fecha_inicio_str = request.data.get('fecha_inicio')
        if fecha_inicio_str:
            try:
                fecha_inicio = date.fromisoformat(fecha_inicio_str)
            except ValueError:
                return Response(
                    {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            fecha_inicio = timezone.now().date()

        nueva_fecha = fecha_inicio + relativedelta(months=duracion)
        dias        = (nueva_fecha - timezone.now().date()).days

        cliente.fecha_inscripcion = fecha_inicio
        cliente.duracion_meses    = duracion
        cliente.fecha_vencimiento = nueva_fecha
        cliente.estado            = 'por_vencer' if dias <= 5 else 'activo'
        cliente.save()

        Notificacion.objects.filter(cliente=cliente).delete()

        return Response(ClienteSerializer(cliente).data)


class ConfiguracionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        config     = Configuracion.get_config()
        serializer = ConfiguracionSerializer(config)
        return Response(serializer.data)

    def patch(self, request):
        config     = Configuracion.get_config()
        serializer = ConfiguracionSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Endpoint público — no requiere token
@api_view(['GET'])
@permission_classes([AllowAny])
def config_publica(request):
    config = Configuracion.get_config()
    return Response({'nombre_gimnasio': config.nombre_gimnasio})