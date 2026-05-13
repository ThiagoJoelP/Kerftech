import styles from './ProyectoCard.module.css'

const ESTADO_LABEL = {
  borrador: 'Borrador',
  presupuestado: 'Presupuestado',
  confirmado: 'Confirmado',
  en_produccion: 'En produccion',
  entregado: 'Entregado',
}

const ESTADO_COLOR = {
  borrador: 'gris',
  presupuestado: 'naranja',
  confirmado: 'verde',
  en_produccion: 'azul',
  entregado: 'oscuro',
}

export default function ProyectoCard({ proyecto, onEditar, onEliminar }) {
  const fecha = proyecto.creadoEn?.toDate?.()?.toLocaleDateString('es-AR') ?? '-'
  const total = proyecto.totalFinal
    ? `$${Number(proyecto.totalFinal).toLocaleString('es-AR')}`
    : '-'

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.top}>
          <h3 className={styles.nombre}>{proyecto.nombre}</h3>
          <span className={`${styles.badge} ${styles[ESTADO_COLOR[proyecto.estado]]}`}>
            {ESTADO_LABEL[proyecto.estado] ?? proyecto.estado}
          </span>
        </div>
        {proyecto.cliente && (
          <p className={styles.cliente}>{proyecto.cliente}</p>
        )}
        <p className={styles.meta}>
          {proyecto.items?.length ?? 0} modulos &middot; Creado {fecha}
        </p>
      </div>
      <div className={styles.right}>
        <p className={styles.total}>{total}</p>
        <div className={styles.acciones}>
          <button className={styles.btnEditar} onClick={onEditar}>Abrir</button>
          <button className={styles.btnEliminar} onClick={onEliminar}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}
