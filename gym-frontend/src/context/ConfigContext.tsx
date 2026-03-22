import { createContext } from "react";

export interface ConfigContextType {
  nombreGimnasio: string;
  diasAvisoPrevio: number;
  recargar: () => void;
}

export const ConfigContext = createContext<ConfigContextType>({
  nombreGimnasio: "GymPro",
  diasAvisoPrevio: 5,
  recargar: () => {},
});
