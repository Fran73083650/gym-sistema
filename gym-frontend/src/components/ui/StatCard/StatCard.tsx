import styles from "./StatCard.module.css";

type Variant = "primary" | "success" | "warning" | "danger" | "info";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  variant?: Variant;
}

export default function StatCard({
  label,
  value,
  icon,
  variant = "primary",
}: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={`${styles.icon} ${styles[variant]}`}>{icon}</div>
      <div className={styles.body}>
        <div className={styles.label}>{label}</div>
        <div className={`${styles.value} ${styles[variant]}`}>{value}</div>
      </div>
    </div>
  );
}
