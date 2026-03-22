import { useState, useEffect } from 'react'
import type { Cliente } from '../types'
import { clientesService, type ClientePayload, type RenovarPayload } from '../services/clientes'
import { useNotificaciones } from './useNotificaciones'

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [cargando, setCargando] = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const { recargar: recargarNotificaciones } = useNotificaciones()

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        setError(null)
        const data = await clientesService.listar()
        setClientes(data)
      } catch {
        setError('Error al cargar los clientes')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const agregarCliente = async (data: ClientePayload) => {
    try {
      const nuevo = await clientesService.crear(data)
      setClientes(prev => [nuevo, ...prev])
    } catch {
      setError('Error al crear el cliente')
    }
  }

  const editarCliente = async (id: number, data: Partial<ClientePayload>) => {
    try {
      const actualizado = await clientesService.editar(id, data)
      setClientes(prev => prev.map(c => c.id === id ? actualizado : c))
    } catch {
      setError('Error al editar el cliente')
    }
  }

  const eliminarCliente = async (id: number) => {
    try {
      await clientesService.eliminar(id)
      setClientes(prev => prev.filter(c => c.id !== id))
    } catch {
      setError('Error al eliminar el cliente')
    }
  }

  const renovarCliente = async (id: number, payload: RenovarPayload) => {
    try {
      const actualizado = await clientesService.renovar(id, payload)
      setClientes(prev => prev.map(c => c.id === id ? actualizado : c))
      await recargarNotificaciones()
    } catch {
      setError('Error al renovar la mensualidad')
    }
  }

  return { clientes, cargando, error, agregarCliente, editarCliente, eliminarCliente, renovarCliente }
}