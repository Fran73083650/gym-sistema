import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { configuracionService } from "../../services/configuracion";
import logoSvg from "../../assets/logo.svg";
import styles from "./Login.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [nombreGimnasio, setNombreGimnasio] = useState("GymPro");

  // Carga el nombre sin necesitar token
  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const nombre = await configuracionService.obtenerPublica();
        setNombreGimnasio(nombre);
      } catch {
        // Si falla mantiene el valor por defecto
      }
    };
    cargarNombre();
  }, []);

  const handleLogin = async () => {
    setError("");
    if (!usuario || !password) {
      setError("Ingresa usuario y contraseña");
      return;
    }
    setCargando(true);
    const ok = await login(usuario, password);
    setCargando(false);
    if (ok) {
      navigate("/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.bgCircle1} />
        <div className={styles.bgCircle2} />
      </div>

      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <img src={logoSvg} alt={nombreGimnasio} className={styles.logo} />
        </div>

        <div className={styles.heading}>
          <h1 className={styles.title}>{nombreGimnasio}</h1>
        </div>
        <p className={styles.subtitle}>Sistema de gestión de gimnasio</p>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Usuario</label>
            <input
              className={styles.input}
              type="text"
              placeholder="admin"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={cargando}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={cargando}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            className={styles.btnLogin}
            onClick={handleLogin}
            disabled={cargando}
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </div>
    </div>
  );
}
