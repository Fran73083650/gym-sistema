import { useContext, useEffect } from 'react'
import { ConfigContext } from '../context/ConfigContext'

export function useConfig() {
  const ctx = useContext(ConfigContext)

  useEffect(() => {
    ctx.recargar()
  }, [])

  return ctx
}