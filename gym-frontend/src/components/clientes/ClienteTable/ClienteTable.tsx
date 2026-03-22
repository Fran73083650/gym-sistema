import { useState, useMemo } from "react";
import type { Cliente } from "../../../types";
import AlertBadge from "../../ui/AlertBadge/AlertBadge";
import styles from "./ClienteTable.module.css";

interface Props {
  clientes: Cliente[];
  onEditar: (cliente: Cliente) => void;
  onEliminar: (id: number) => void;
  onRenovar: (cliente: Cliente) => void;
}

type Estado = "activo" | "por_vencer" | "vencido";

export default function ClienteTable({
  clientes,
  onEditar,
  onEliminar,
  onRenovar,
}: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState<Set<Estado>>(new Set());

  const ahora = useMemo(() => new Date(), []);

  const toggleFiltro = (estado: Estado) => {
    setFiltros((prev) => {
      const next = new Set(prev);
      if (next.has(estado)) {
        next.delete(estado);
      } else {
        next.add(estado);
      }
      return next;
    });
  };

  const limpiarFiltros = () => setFiltros(new Set());

  const filtrados = clientes.filter((c) => {
    const matchBusqueda =
      `${c.nombres} ${c.apellidos}`
        .toLowerCase()
        .includes(busqueda.toLowerCase()) || c.celular.includes(busqueda);
    const matchFiltro = filtros.size === 0 || filtros.has(c.estado as Estado);
    return matchBusqueda && matchFiltro;
  });

  const diasRestantes = (fechaVencimiento: string) => {
    const vence = new Date(fechaVencimiento + "T00:00:00");
    return Math.floor(
      (vence.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  const fechaClase = (dias: number) => {
    if (dias < 0) return styles.over;
    if (dias <= 5) return styles.soon;
    return styles.ok;
  };

  const formatFecha = (fecha: string) =>
    new Date(fecha + "T00:00:00").toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const totalActivos = clientes.filter((c) => c.estado === "activo").length;
  const totalPorVencer = clientes.filter(
    (c) => c.estado === "por_vencer",
  ).length;
  const totalVencidos = clientes.filter((c) => c.estado === "vencido").length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por nombre o celular..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className={styles.filtrosGroup}>
          <span className={styles.filtrosLabel}>Filtrar por: </span>
          <div className={styles.filtros}>
            <button
              className={`${styles.filtroBtn} ${styles.filtroBtnActivo} ${filtros.has("activo") ? styles.active : ""}`}
              onClick={() => toggleFiltro("activo")}
            >
              Activo
              <span className={styles.filtroBadge}>{totalActivos}</span>
            </button>

            <button
              className={`${styles.filtroBtn} ${styles.filtroBtnPorVencer} ${filtros.has("por_vencer") ? styles.active : ""}`}
              onClick={() => toggleFiltro("por_vencer")}
            >
              Por vencer
              <span className={styles.filtroBadge}>{totalPorVencer}</span>
            </button>

            <button
              className={`${styles.filtroBtn} ${styles.filtroBtnVencido} ${filtros.has("vencido") ? styles.active : ""}`}
              onClick={() => toggleFiltro("vencido")}
            >
              Vencido
              <span className={styles.filtroBadge}>{totalVencidos}</span>
            </button>

            {filtros.size > 0 && (
              <button className={styles.filtroClear} onClick={limpiarFiltros}>
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>

        <span className={styles.count}>
          {filtrados.length} cliente{filtrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Cliente</th>
            <th>Celular</th>
            <th>Meses</th>
            <th>Inicio</th>
            <th>Vence</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>👤</span>
                  <div className={styles.emptyText}>
                    No se encontraron clientes
                  </div>
                  <div className={styles.emptySubtext}>
                    Intenta con otro filtro o registra un nuevo cliente
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            filtrados.map((cliente) => {
              const dias = diasRestantes(cliente.fecha_vencimiento);
              return (
                <tr key={cliente.id} className={styles.row}>
                  <td>
                    <div className={styles.clienteInfo}>
                      <span className={styles.clienteNombre}>
                        {cliente.nombres}
                      </span>
                      <span className={styles.clienteApellido}>
                        {cliente.apellidos}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.mono}>{cliente.celular}</span>
                  </td>
                  <td>
                    {cliente.duracion_meses}{" "}
                    {cliente.duracion_meses === 1 ? "mes" : "meses"}
                  </td>
                  <td>
                    <span className={styles.mono}>
                      {formatFecha(cliente.fecha_inscripcion)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.fechaVence} ${fechaClase(dias)}`}
                    >
                      {formatFecha(cliente.fecha_vencimiento)}
                      {dias >= 0 && dias <= 5 && <span> ({dias}d)</span>}
                      {dias < 0 && <span> ({Math.abs(dias)}d atrás)</span>}
                    </span>
                  </td>
                  <td>
                    <AlertBadge estado={cliente.estado} />
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {(cliente.estado === "vencido" ||
                        cliente.estado === "por_vencer") && (
                        <button
                          className={styles.btnRenovar}
                          onClick={() => onRenovar(cliente)}
                        >
                          Renovar
                        </button>
                      )}
                      <button
                        className={styles.btnEdit}
                        onClick={() => onEditar(cliente)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={() => {
                          if (
                            confirm(
                              `¿Eliminar a ${cliente.nombres} ${cliente.apellidos}?`,
                            )
                          ) {
                            onEliminar(cliente.id);
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
