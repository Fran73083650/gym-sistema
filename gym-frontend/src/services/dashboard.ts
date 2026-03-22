import api from './api'

export interface Stats {
  total:      number
  activos:    number
  por_vencer: number
  vencidos:   number
}

export const dashboardService = {
  stats: async (): Promise<Stats> => {
    const res = await api.get<Stats>('/api/clientes/stats/')
    return res.data
  },
}