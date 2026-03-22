import type { Cliente } from "../../../types";
import type { ClientePayload } from "../../../services/clientes";
import ClienteForm from "../ClienteForm/ClienteForm";
import styles from "./ClienteModal.module.css";

interface Props {
  abierto: boolean;
  cliente: Cliente | null;
  onGuardar: (data: ClientePayload) => void;
  onCerrar: () => void;
}

export default function ClienteModal({
  abierto,
  cliente,
  onGuardar,
  onCerrar,
}: Props) {
  if (!abierto) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>{cliente ? "✏️" : "➕"}</div>
            <div>
              <div className={styles.title}>
                {cliente ? "Editar cliente" : "Nuevo cliente"}
              </div>
              <div className={styles.subtitle}>
                {cliente
                  ? `Modificando a ${cliente.nombres} ${cliente.apellidos}`
                  : "Completa los datos para registrar al cliente"}
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onCerrar}>
            ✕
          </button>
        </div>
        <div className={styles.body}>
          <ClienteForm
            key={cliente?.id ?? "nuevo"}
            cliente={cliente}
            onGuardar={onGuardar}
            onCancelar={onCerrar}
          />
        </div>
      </div>
    </div>
  );
}
