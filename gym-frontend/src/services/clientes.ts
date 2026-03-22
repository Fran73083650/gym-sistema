import api from './api'
import type { Cliente } from '../types'

export interface ClientePayload {
  nombres:           string
  apellidos:         string
  celular:           string
  fecha_inscripcion: string
  duracion_meses:    number
}

export interface RenovarPayload {
  duracion_meses: number
  fecha_inicio:   string
}

export const clientesService = {
  listar: async (): Promise<Cliente[]> => {
    const res = await api.get<Cliente[]>('/api/clientes/')
    return res.data
  },

  crear: async (data: ClientePayload): Promise<Cliente> => {
    const res = await api.post<Cliente>('/api/clientes/', data)
    return res.data
  },

  editar: async (id: number, data: Partial<ClientePayload>): Promise<Cliente> => {
    const res = await api.patch<Cliente>(`/api/clientes/${id}/`, data)
    return res.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/api/clientes/${id}/`)
  },

  renovar: async (id: number, payload: RenovarPayload): Promise<Cliente> => {
    const res = await api.post<Cliente>(`/api/clientes/${id}/renovar/`, payload)
    return res.data
  },
}