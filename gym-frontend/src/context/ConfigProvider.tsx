import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { ConfigContext } from "./ConfigContext";
import { configuracionService } from "../services/configuracion";

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [nombreGimnasio, setNombreGimnasio] = useState("GymPro");
  const [diasAvisoPrevio, setDiasAvisoPrevio] = useState(5);

  const recargar = useCallback(async () => {
    try {
      const data = await configuracionService.obtener();
      setNombreGimnasio(data.nombre_gimnasio);
      setDiasAvisoPrevio(data.dias_aviso_previo);
    } catch {
      // mantiene los valores por defecto si falla
    }
  }, []);

  return (
    <ConfigContext.Provider
      value={{ nombreGimnasio, diasAvisoPrevio, recargar }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
