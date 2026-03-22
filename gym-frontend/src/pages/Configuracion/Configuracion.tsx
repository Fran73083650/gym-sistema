import { useState, useEffect } from "react";
import {
  configuracionService,
  type ConfiguracionData,
} from "../../services/configuracion";
import { useConfig } from "../../hooks/useConfig";
import styles from "./Configuracion.module.css";

export default function Configuracion() {
  const { recargar } = useConfig();

  const [form, setForm] = useState<ConfiguracionData>({
    nombre_gimnasio: "GymPro",
    dias_aviso_previo: 5,
  });
  const [cargando, setCargando] = useState(true);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await configuracionService.obtener();
        setForm(data);
      } catch {
        setError("Error al cargar la configuración");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const handleGuardar = async () => {
    try {
      setError(null);
      await configuracionService.guardar(form);
      setGuardado(true);
      recargar();
      setTimeout(() => setGuardado(false), 3000);
    } catch {
      setError("Error al guardar la configuración");
    }
  };

  const set = (field: keyof ConfiguracionData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setGuardado(false);
  };

  if (cargando) return <div className={styles.loading}>Cargando...</div>;

  return (
    <div className={styles.page}>
      {guardado && (
        <div className={styles.toast}>
          ✅ Configuración guardada correctamente
        </div>
      )}

      {error && <div className={styles.toastError}>❌ {error}</div>}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon}>🏋️</span>
          <span className={styles.cardTitle}>Datos del gimnasio</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.field}>
            <label className={styles.label}>Nombre del gimnasio</label>
            <input
              className={styles.input}
              placeholder="Ej: GymPro"
              value={form.nombre_gimnasio}
              onChange={(e) => set("nombre_gimnasio", e.target.value)}
            />
            <span className={styles.hint}>
              Este nombre aparecerá en el menú lateral del sistema.
            </span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon}>🔔</span>
          <span className={styles.cardTitle}>Alertas del sistema</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.field}>
            <label className={styles.label}>
              Días de aviso previo al vencimiento
            </label>
            <div className={styles.inputRow}>
              <input
                type="number"
                className={styles.input}
                min={1}
                max={30}
                style={{ maxWidth: "100px" }}
                value={form.dias_aviso_previo}
                onChange={(e) =>
                  set(
                    "dias_aviso_previo",
                    Math.max(1, parseInt(e.target.value) || 1),
                  )
                }
              />
              <span className={styles.inputSuffix}>
                días antes del vencimiento
              </span>
            </div>
            <span className={styles.hint}>
              Se mostrará una alerta cuando falten {form.dias_aviso_previo} día
              {form.dias_aviso_previo !== 1 ? "s" : ""} o menos para que venza
              la mensualidad.
            </span>
          </div>

          <button className={styles.btnGuardar} onClick={handleGuardar}>
            Guardar configuración
          </button>
        </div>
      </div>
    </div>
  );
}
