import { useState } from "react";
import type { Cliente } from "../../../types";
import type { RenovarPayload } from "../../../services/clientes";
import styles from "./RenovarModal.module.css";

interface Props {
  abierto: boolean;
  cliente: Cliente | null;
  onRenovar: (id: number, payload: RenovarPayload) => void;
  onCerrar: () => void;
}

const hoy = () => new Date().toISOString().split("T")[0];

export default function RenovarModal({
  abierto,
  cliente,
  onRenovar,
  onCerrar,
}: Props) {
  const [meses, setMeses] = useState(1);
  const [fechaInicio, setFechaInicio] = useState(hoy());

  if (!abierto || !cliente) return null;

  const calcularVencimiento = () => {
    const base = new Date(fechaInicio + "T00:00:00");
    const vence = new Date(base);
    vence.setMonth(vence.getMonth() + meses);
    return vence.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleConfirmar = () => {
    onRenovar(cliente.id, {
      duracion_meses: meses,
      fecha_inicio: fechaInicio,
    });
    onCerrar();
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>🔄</div>
            <div>
              <div className={styles.title}>Renovar mensualidad</div>
              <div className={styles.subtitle}>
                {cliente.nombres} {cliente.apellidos}
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onCerrar}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.estadoActual}>
            <span className={styles.estadoLabel}>Estado actual</span>
            <span className={`${styles.estadoBadge} ${styles[cliente.estado]}`}>
              {cliente.estado === "vencido" ? "Vencido" : "Por vencer"}
            </span>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Fecha de inicio</label>
              <input
                type="date"
                className={styles.input}
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Duración</label>
              <div className={styles.duracionRow}>
                <input
                  type="number"
                  className={styles.input}
                  min={1}
                  max={24}
                  value={meses}
                  onChange={(e) =>
                    setMeses(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  style={{ width: "80px" }}
                />
                <span className={styles.duracionLabel}>
                  mes{meses !== 1 ? "es" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.venceInfo}>
            <span className={styles.venceLabel}>
              Nueva fecha de vencimiento
            </span>
            <span className={styles.venceFecha}>{calcularVencimiento()}</span>
          </div>

          <p className={styles.nota}>
            Las notificaciones pendientes de este cliente se eliminarán
            automáticamente al renovar.
          </p>

          <div className={styles.footer}>
            <button className={styles.btnCancel} onClick={onCerrar}>
              Cancelar
            </button>
            <button className={styles.btnRenovar} onClick={handleConfirmar}>
              Confirmar renovación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
