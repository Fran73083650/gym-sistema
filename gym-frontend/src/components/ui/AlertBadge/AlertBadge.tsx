import styles from "./AlertBadge.module.css";

type Estado = "activo" | "por_vencer" | "vencido";

const CONFIG = {
  activo: { label: "Activo", cls: "success" },
  por_vencer: { label: "Por vencer", cls: "warning" },
  vencido: { label: "Vencido", cls: "danger" },
};

export default function AlertBadge({ estado }: { estado: Estado }) {
  const { label, cls } = CONFIG[estado];
  return (
    <span className={`${styles.badge} ${styles[cls]}`}>
      <span className={styles.dot} />
      {label}
    </span>
  );
}
