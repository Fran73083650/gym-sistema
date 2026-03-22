import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useConfig } from "../../../hooks/useConfig";
import { useNotificaciones } from "../../../hooks/useNotificaciones";
import logoSvg from "../../../assets/logo.svg";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/clientes", label: "Clientes", icon: "◉" },
  { to: "/notificaciones", label: "Notificaciones", icon: "◎", badge: true },
  { to: "/configuracion", label: "Configuración", icon: "⚙" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const { noLeidas } = useNotificaciones();
  const { nombreGimnasio } = useConfig();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src={logoSvg} alt="Logo" className={styles.logo} />
        <div className={styles.brandText}>
          <span className={styles.brandName}>{nombreGimnasio}</span>
          <span className={styles.brandSub}>Sistema de gestión</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <span className={styles.navSection}>Menú</span>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem}${isActive ? " " + styles.active : ""}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
            {item.badge && noLeidas > 0 && (
              <span className={styles.badge}>{noLeidas}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span className={styles.navIcon}>⏻</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
