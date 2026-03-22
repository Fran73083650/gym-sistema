from django.db import models
from apps.clientes.models import Cliente

class Notificacion(models.Model):
    TIPO_CHOICES = [
        ('vencimiento_proximo', 'Vencimiento próximo'),
        ('vencido',             'Vencido'),
    ]

    cliente = models.ForeignKey(
                  Cliente,
                  on_delete=models.CASCADE,
                  related_name='notificaciones'
              )
    mensaje = models.TextField()
    tipo    = models.CharField(max_length=30, choices=TIPO_CHOICES)
    fecha   = models.DateField(auto_now_add=True)
    leida   = models.BooleanField(default=False)

    class Meta:
        ordering            = ['-fecha', '-id']
        verbose_name        = 'Notificación'
        verbose_name_plural = 'Notificaciones'

    def __str__(self):
        return f'{self.cliente} — {self.tipo}'