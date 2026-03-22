import api from './api'
import type { Notificacion } from '../types'

export const notificacionesService = {
  listar: async (): Promise<Notificacion[]> => {
    const res = await api.get<Notificacion[]>('/api/notif/')
    return res.data
  },

  marcarLeida: async (id: number): Promise<Notificacion> => {
    const res = await api.patch<Notificacion>(`/api/notif/${id}/marcar_leida/`)
    return res.data
  },

  marcarTodasLeidas: async (): Promise<void> => {
    await api.patch('/api/notif/marcar_todas_leidas/')
  },

  eliminarLeidas: async (): Promise<void> => {
    await api.delete('/api/notif/eliminar_leidas/')
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/api/notif/${id}/`)
  },
}