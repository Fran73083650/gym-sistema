import { useState } from "react";
import type { Cliente } from "../../types";
import type { ClientePayload } from "../../services/clientes";
import type { RenovarPayload } from "../../services/clientes";
import { useClientes } from "../../hooks/useClientes";
import ClienteTable from "../../components/clientes/ClienteTable/ClienteTable";
import ClienteModal from "../../components/clientes/ClienteModal/ClienteModal";
import RenovarModal from "../../components/clientes/RenovarModal/RenovarModal";
import styles from "./Clientes.module.css";

export default function Clientes() {
  const {
    clientes,
    cargando,
    error,
    agregarCliente,
    editarCliente,
    eliminarCliente,
    renovarCliente,
  } = useClientes();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [renovarAbierto, setRenovarAbierto] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);

  const activos = clientes.filter((c) => c.estado === "activo").length;
  const porVencer = clientes.filter((c) => c.estado === "por_vencer").length;
  const vencidos = clientes.filter((c) => c.estado === "vencido").length;

  const handleNuevo = () => {
    setClienteSeleccionado(null);
    setModalAbierto(true);
  };
  const handleEditar = (c: Cliente) => {
    setClienteSeleccionado(c);
    setModalAbierto(true);
  };
  const handleRenovar = (c: Cliente) => {
    setClienteSeleccionado(c);
    setRenovarAbierto(true);
  };
  const handleCerrar = () => {
    setModalAbierto(false);
    setRenovarAbierto(false);
    setClienteSeleccionado(null);
  };

  const handleGuardar = async (data: ClientePayload) => {
    if (clienteSeleccionado) {
      await editarCliente(clienteSeleccionado.id, data);
    } else {
      await agregarCliente(data);
    }
    handleCerrar();
  };

  const handleConfirmarRenovacion = async (
    id: number,
    payload: RenovarPayload,
  ) => {
    await renovarCliente(id, payload);
    handleCerrar();
  };

  if (cargando)
    return <div className={styles.loading}>Cargando clientes...</div>;
  if (error) return <div className={styles.errorMsg}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.stats}>
          <span className={`${styles.pill} ${styles.total}`}>
            {clientes.length} total
          </span>
          <span className={`${styles.pill} ${styles.success}`}>
            {activos} activos
          </span>
          <span className={`${styles.pill} ${styles.warning}`}>
            {porVencer} por vencer
          </span>
          <span className={`${styles.pill} ${styles.danger}`}>
            {vencidos} vencidos
          </span>
        </div>
        <button className={styles.btnNuevo} onClick={handleNuevo}>
          <span className={styles.btnNuevoIcon}>+</span>
          Nuevo cliente
        </button>
      </div>

      <ClienteTable
        clientes={clientes}
        onEditar={handleEditar}
        onEliminar={eliminarCliente}
        onRenovar={handleRenovar}
      />

      <ClienteModal
        abierto={modalAbierto}
        cliente={clienteSeleccionado}
        onGuardar={handleGuardar}
        onCerrar={handleCerrar}
      />

      <RenovarModal
        abierto={renovarAbierto}
        cliente={clienteSeleccionado}
        onRenovar={handleConfirmarRenovacion}
        onCerrar={handleCerrar}
      />
    </div>
  );
}
