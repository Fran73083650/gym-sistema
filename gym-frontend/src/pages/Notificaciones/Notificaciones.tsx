import { useEffect } from "react";
import { useNotificaciones } from "../../hooks/useNotificaciones";
import styles from "./Notificaciones.module.css";
import type { Notificacion } from "../../types";

export default function Notificaciones() {
  const {
    notificaciones,
    noLeidas,
    cargando,
    recargar,
    marcarLeida,
    marcarTodasLeidas,
    eliminarLeidas,
    eliminar,
  } = useNotificaciones();

  // Recarga al entrar a la página para obtener nuevas notificaciones del backend
  useEffect(() => {
    recargar();
  }, []);

  const leidas = notificaciones.filter((n) => n.leida).length;
  const porVencer = notificaciones.filter(
    (n) => n.tipo === "vencimiento_proximo",
  );
  const vencidos = notificaciones.filter((n) => n.tipo === "vencido");

  if (cargando)
    return <div className={styles.loading}>Cargando notificaciones...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          {noLeidas > 0 ? (
            <span className={styles.badgeCount}>{noLeidas} sin leer</span>
          ) : (
            <span className={styles.infoNote}>Todo al día ✓</span>
          )}
        </div>
        <div className={styles.topBarRight}>
          {noLeidas > 0 && (
            <button
              className={styles.btnMarcarTodas}
              onClick={marcarTodasLeidas}
            >
              Marcar todas como leídas
            </button>
          )}
          {leidas > 0 && (
            <button className={styles.btnEliminar} onClick={eliminarLeidas}>
              Eliminar leídas ({leidas})
            </button>
          )}
        </div>
      </div>

      {notificaciones.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔔</span>
          <div className={styles.emptyText}>Sin notificaciones</div>
          <div className={styles.emptySubtext}>
            Todos los clientes están al día
          </div>
        </div>
      ) : (
        <>
          {porVencer.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>⚠️ Por vencer pronto</div>
              <div className={styles.list}>
                {porVencer.map((n) => (
                  <NotifCard
                    key={n.id}
                    n={n}
                    onMarcar={marcarLeida}
                    onEliminar={eliminar}
                  />
                ))}
              </div>
            </div>
          )}

          {vencidos.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>🔴 Vencidos</div>
              <div className={styles.list}>
                {vencidos.map((n) => (
                  <NotifCard
                    key={n.id}
                    n={n}
                    onMarcar={marcarLeida}
                    onEliminar={eliminar}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface CardProps {
  n: Notificacion;
  onMarcar: (id: number) => void;
  onEliminar: (id: number) => void;
}

function NotifCard({ n, onMarcar, onEliminar }: CardProps) {
  return (
    <div className={`${styles.item} ${!n.leida ? styles.noLeida : ""}`}>
      <div
        className={`${styles.iconWrapper} ${n.tipo === "vencido" ? styles.danger : styles.warning}`}
      >
        {n.tipo === "vencido" ? "🔴" : "⚠️"}
      </div>

      <div className={styles.body}>
        <div className={styles.clienteNombre}>{n.cliente_nombre}</div>
        <div className={styles.mensaje}>{n.mensaje}</div>

        <div className={styles.cardActions}>
          {!n.leida && (
            <button className={styles.btnLeida} onClick={() => onMarcar(n.id)}>
              ✓ Marcar como leída
            </button>
          )}
          <button
            className={styles.btnEliminarItem}
            onClick={() => onEliminar(n.id)}
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.fecha}>{n.fecha}</span>
        {!n.leida ? (
          <span className={styles.dotNoLeida} />
        ) : (
          <span className={styles.tagLeida}>Leída</span>
        )}
      </div>
    </div>
  );
}
