from django.db import models

class Cliente(models.Model):
    ESTADO_CHOICES = [
        ('activo',     'Activo'),
        ('por_vencer', 'Por vencer'),
        ('vencido',    'Vencido'),
    ]

    nombres           = models.CharField(max_length=100)
    apellidos         = models.CharField(max_length=100)
    celular           = models.CharField(max_length=15)
    fecha_inscripcion = models.DateField()                  # ← ya no auto_now_add
    duracion_meses    = models.PositiveIntegerField(default=1)
    fecha_vencimiento = models.DateField()
    estado            = models.CharField(
                            max_length=20,
                            choices=ESTADO_CHOICES,
                            default='activo'
                        )

    class Meta:
        ordering            = ['-fecha_inscripcion']
        verbose_name        = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return f'{self.nombres} {self.apellidos}'


class Configuracion(models.Model):
    nombre_gimnasio   = models.CharField(max_length=100, default='GymPro')
    dias_aviso_previo = models.PositiveIntegerField(default=5)

    class Meta:
        verbose_name        = 'Configuración'
        verbose_name_plural = 'Configuración'

    def __str__(self):
        return self.nombre_gimnasio

    @classmethod
    def get_config(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj