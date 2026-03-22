import { useNavigate, useLocation } from "react-router-dom";
import { useNotificaciones } from "../../../hooks/useNotificaciones";
import { useAuth } from "../../../hooks/useAuth";
import styles from "./Navbar.module.css";

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Dashboard", sub: "Resumen general del gimnasio" },
  "/clientes": {
    title: "Clientes",
    sub: "Gestión de inscripciones y mensualidades",
  },
  "/notificaciones": {
    title: "Notificaciones",
    sub: "Alertas de vencimientos",
  },
  "/configuracion": { title: "Configuración", sub: "Ajustes del sistema" },
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { noLeidas } = useNotificaciones();
  const { username } = useAuth();
  const page = PAGE_TITLES[location.pathname] ?? { title: "GymPro", sub: "" };
  const inicial = username?.charAt(0).toUpperCase() ?? "A";

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.pageTitle}>{page.title}</span>
        {page.sub && <span className={styles.pageSub}>{page.sub}</span>}
      </div>
      <div className={styles.right}>
        <button
          className={styles.notifBtn}
          onClick={() => navigate("/notificaciones")}
          title="Notificaciones"
        >
          🔔
          {noLeidas > 0 && <span className={styles.notifDot} />}
        </button>
        <div className={styles.userChip}>
          <div className={styles.avatar}>{inicial}</div>
          <div>
            <div className={styles.userName}>{username || "Admin"}</div>
            <div className={styles.userRole}>Administrador</div>
          </div>
        </div>
      </div>
    </header>
  );
}
