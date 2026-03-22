import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificaciones } from "../../hooks/useNotificaciones";
import { dashboardService, type Stats } from "../../services/dashboard";
import { clientesService } from "../../services/clientes";
import type { Cliente } from "../../types";
import StatCard from "../../components/ui/StatCard/StatCard";
import AlertBadge from "../../components/ui/AlertBadge/AlertBadge";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { notificaciones } = useNotificaciones();

  const [stats, setStats] = useState<Stats | null>(null);
  const [recientes, setRecientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [statsData, clientesData] = await Promise.all([
          dashboardService.stats(),
          clientesService.listar(),
        ]);
        setStats(statsData);
        setRecientes(clientesData.slice(0, 5));
      } catch {
        console.error("Error al cargar dashboard");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  const alertas = notificaciones.filter((n) => !n.leida).slice(0, 5);

  if (cargando) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.statsGrid}>
        <StatCard
          label="Total clientes"
          value={stats?.total ?? 0}
          icon="👥"
          variant="primary"
        />
        <StatCard
          label="Activos"
          value={stats?.activos ?? 0}
          icon="✅"
          variant="success"
        />
        <StatCard
          label="Por vencer"
          value={stats?.por_vencer ?? 0}
          icon="⚠️"
          variant="warning"
        />
        <StatCard
          label="Vencidos"
          value={stats?.vencidos ?? 0}
          icon="🔴"
          variant="danger"
        />
      </div>

      <div className={styles.grid2}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Alertas pendientes</span>
            <button
              className={styles.sectionLink}
              onClick={() => navigate("/notificaciones")}
            >
              Ver todas →
            </button>
          </div>
          <div className={styles.alertList}>
            {alertas.length === 0 ? (
              <div className={styles.emptyAlert}>Sin alertas pendientes ✓</div>
            ) : (
              alertas.map((n) => (
                <div key={n.id} className={styles.alertItem}>
                  <span
                    className={`${styles.alertDot} ${n.tipo === "vencido" ? styles.danger : styles.warning}`}
                  />
                  <div className={styles.alertBody}>
                    <div className={styles.alertName}>{n.cliente_nombre}</div>
                    <div className={styles.alertMsg}>{n.mensaje}</div>
                  </div>
                  <span className={styles.alertFecha}>{n.fecha}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Clientes recientes</span>
            <button
              className={styles.sectionLink}
              onClick={() => navigate("/clientes")}
            >
              Ver todos →
            </button>
          </div>
          <div className={styles.clientList}>
            {recientes.length === 0 ? (
              <div className={styles.emptyAlert}>
                No hay clientes registrados
              </div>
            ) : (
              recientes.map((c) => (
                <div key={c.id} className={styles.clientItem}>
                  <div className={styles.clientAvatar}>
                    {c.nombres.charAt(0)}
                    {c.apellidos.charAt(0)}
                  </div>
                  <div className={styles.clientBody}>
                    <div className={styles.clientName}>
                      {c.nombres} {c.apellidos}
                    </div>
                    <div className={styles.clientDni}>{c.celular}</div>
                  </div>
                  <AlertBadge estado={c.estado} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
