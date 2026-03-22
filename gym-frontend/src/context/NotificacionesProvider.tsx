import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Notificacion } from "../types";
import { NotificacionesContext } from "./NotificacionesContext";
import { notificacionesService } from "../services/notificaciones";

export function NotificacionesProvider({ children }: { children: ReactNode }) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    try {
      setCargando(true);
      const data = await notificacionesService.listar();
      setNotificaciones(data);
    } catch {
      console.error("Error al cargar notificaciones");
    } finally {
      setCargando(false);
    }
  }, []);

  const marcarLeida = useCallback(async (id: number) => {
    try {
      const actualizada = await notificacionesService.marcarLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? actualizada : n)),
      );
    } catch {
      console.error("Error al marcar notificación");
    }
  }, []);

  const marcarTodasLeidas = useCallback(async () => {
    try {
      await notificacionesService.marcarTodasLeidas();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    } catch {
      console.error("Error al marcar todas");
    }
  }, []);

  const eliminarLeidas = useCallback(async () => {
    try {
      await notificacionesService.eliminarLeidas();
      setNotificaciones((prev) => prev.filter((n) => !n.leida));
    } catch {
      console.error("Error al eliminar leídas");
    }
  }, []);

  const eliminar = useCallback(async (id: number) => {
    try {
      await notificacionesService.eliminar(id);
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
    } catch {
      console.error("Error al eliminar notificación");
    }
  }, []);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <NotificacionesContext.Provider
      value={{
        notificaciones,
        noLeidas,
        cargando,
        recargar,
        marcarLeida,
        marcarTodasLeidas,
        eliminarLeidas,
        eliminar,
      }}
    >
      {children}
    </NotificacionesContext.Provider>
  );
}
