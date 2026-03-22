import { useState } from "react";
import type { Cliente } from "../../../types";
import type { ClientePayload } from "../../../services/clientes";
import styles from "./ClienteForm.module.css";

type FormErrors = {
  nombres?: string;
  apellidos?: string;
  celular?: string;
};

interface FormState {
  nombres: string;
  apellidos: string;
  celular: string;
  fecha_inscripcion: string;
  duracion_meses: number;
}

interface Props {
  cliente?: Cliente | null;
  onGuardar: (data: ClientePayload) => void;
  onCancelar: () => void;
}

const hoy = () => new Date().toISOString().split("T")[0];

const makeInitial = (cliente?: Cliente | null): FormState => ({
  nombres: cliente?.nombres ?? "",
  apellidos: cliente?.apellidos ?? "",
  celular: cliente?.celular ?? "",
  fecha_inscripcion: cliente?.fecha_inscripcion ?? hoy(),
  duracion_meses: cliente?.duracion_meses ?? 1,
});

export default function ClienteForm({ cliente, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState<FormState>(() => makeInitial(cliente));
  const [errors, setErrors] = useState<FormErrors>({});

  const calcularVencimiento = (inicio: string, meses: number) => {
    const base = new Date(inicio + "T00:00:00");
    const vence = new Date(base);
    vence.setMonth(vence.getMonth() + meses);
    return vence.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.nombres.trim()) e.nombres = "Campo requerido";
    if (!form.apellidos.trim()) e.apellidos = "Campo requerido";
    if (!/^\d{9}$/.test(form.celular))
      e.celular = "Celular debe tener 9 dígitos";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    onGuardar(form);
  };

  const setField = (field: keyof FormState, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>
            Nombres <span className={styles.required}>*</span>
          </label>
          <input
            className={`${styles.input} ${errors.nombres ? styles.error : ""}`}
            placeholder="Ej: Carlos Alberto"
            value={form.nombres}
            onChange={(e) => setField("nombres", e.target.value)}
          />
          {errors.nombres && (
            <span className={styles.errorMsg}>{errors.nombres}</span>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            Apellidos <span className={styles.required}>*</span>
          </label>
          <input
            className={`${styles.input} ${errors.apellidos ? styles.error : ""}`}
            placeholder="Ej: Rodríguez Huanca"
            value={form.apellidos}
            onChange={(e) => setField("apellidos", e.target.value)}
          />
          {errors.apellidos && (
            <span className={styles.errorMsg}>{errors.apellidos}</span>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>
            Celular <span className={styles.required}>*</span>
          </label>
          <input
            className={`${styles.input} ${errors.celular ? styles.error : ""}`}
            placeholder="987654321"
            maxLength={9}
            value={form.celular}
            onChange={(e) =>
              setField("celular", e.target.value.replace(/\D/g, ""))
            }
          />
          {errors.celular && (
            <span className={styles.errorMsg}>{errors.celular}</span>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Fecha de inicio</label>
          <input
            type="date"
            className={styles.input}
            value={form.fecha_inscripcion}
            onChange={(e) => setField("fecha_inscripcion", e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Duración de mensualidad <span className={styles.required}>*</span>
        </label>
        <div className={styles.duracionRow}>
          <input
            type="number"
            className={`${styles.input} ${styles.duracionInput}`}
            min={1}
            max={24}
            value={form.duracion_meses}
            onChange={(e) =>
              setField(
                "duracion_meses",
                Math.max(1, parseInt(e.target.value) || 1),
              )
            }
          />
          <span className={styles.duracionLabel}>
            mes{form.duracion_meses !== 1 ? "es" : ""}
          </span>
        </div>
      </div>

      <div className={styles.venceInfo}>
        <span className={styles.venceLabel}>Fecha de vencimiento</span>
        <span className={styles.venceFecha}>
          {calcularVencimiento(form.fecha_inscripcion, form.duracion_meses)}
        </span>
      </div>

      <div className={styles.footer}>
        <button className={styles.btnCancel} onClick={onCancelar}>
          Cancelar
        </button>
        <button className={styles.btnSave} onClick={handleSubmit}>
          {cliente ? "Guardar cambios" : "Registrar cliente"}
        </button>
      </div>
    </div>
  );
}
