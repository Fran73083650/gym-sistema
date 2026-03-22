import api from './api'

interface LoginResponse {
  access:   string
  refresh:  string
  username: string
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/api/auth/login/', { username, password })
    return res.data
  },

  logout: async () => {
    await api.post('/api/auth/logout/')
    localStorage.removeItem('gym_token')
    localStorage.removeItem('gym_refresh')
    localStorage.removeItem('gym_user')
  },
}