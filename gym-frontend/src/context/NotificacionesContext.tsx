import { createContext } from "react";
import type { Notificacion } from "../types";

export interface NotificacionesContextType {
  notificaciones: Notificacion[];
  noLeidas: number;
  cargando: boolean;
  recargar: () => Promise<void>;
  marcarLeida: (id: number) => Promise<void>;
  marcarTodasLeidas: () => Promise<void>;
  eliminarLeidas: () => Promise<void>;
  eliminar: (id: number) => Promise<void>;
}

export const NotificacionesContext = createContext<NotificacionesContextType>({
  notificaciones: [],
  noLeidas: 0,
  cargando: true,
  recargar: async () => {},
  marcarLeida: async () => {},
  marcarTodasLeidas: async () => {},
  eliminarLeidas: async () => {},
  eliminar: async () => {},
});
