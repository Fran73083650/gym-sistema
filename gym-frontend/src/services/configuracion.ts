import api from './api'
import axios from 'axios'

export interface ConfiguracionData {
  nombre_gimnasio:   string
  dias_aviso_previo: number
}

export const configuracionService = {
  obtener: async (): Promise<ConfiguracionData> => {
    const res = await api.get<ConfiguracionData>('/api/clientes/config/')
    return res.data
  },

  guardar: async (data: Partial<ConfiguracionData>): Promise<ConfiguracionData> => {
    const res = await api.patch<ConfiguracionData>('/api/clientes/config/', data)
    return res.data
  },

  // ✅ Sin token — para el Login
  obtenerPublica: async (): Promise<string> => {
    const res = await axios.get<{ nombre_gimnasio: string }>(
      `${import.meta.env.VITE_API_URL}/api/clientes/config/publica/`
    )
    return res.data.nombre_gimnasio
  },
}