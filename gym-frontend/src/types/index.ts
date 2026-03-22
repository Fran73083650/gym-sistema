export interface Cliente {
  id:                number
  nombres:           string
  apellidos:         string
  celular:           string
  fecha_inscripcion: string
  duracion_meses:    number
  fecha_vencimiento: string
  estado:            'activo' | 'por_vencer' | 'vencido'
}

export interface Notificacion {
  id:             number
  cliente:        number
  cliente_nombre: string
  mensaje:        string
  tipo:           'vencimiento_proximo' | 'vencido'
  fecha:          string
  leida:          boolean
}

export interface Configuracion {
  nombreGimnasio:  string
  diasAvisoPrevio: number
}

export interface DashboardStats {
  totalClientes: number
  clientesActivos: number
  clientesPorVencer: number
  clientesVencidos: number
}