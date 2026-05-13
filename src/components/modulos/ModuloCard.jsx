import { calcularModulo } from '@/utils/calculos'
import styles from './ModuloCard.module.css'

export default function ModuloCard({ modulo, onEditar, onDesactivar }) {
  const { m2Total, metrosCanto, placasNecesarias } = calcularModulo(
    modulo.piezas ?? [],
    modulo.herrajes ?? [],
    modulo.dimensionesPlaca ?? null
  )

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.nombre}>{modulo.nombre}</h3>
          <span className={styles.badge}>{modulo.categoria}</span>
          <span className={`${styles.badge} ${styles.badgeTipo}`}>{modulo.tipo}</span>
        </div>
        <div className={styles.acciones}>
          <button className={styles.btnEditar} onClick={onEditar}>Editar</button>
          <button className={styles.btnQuitar} onClick={onDesactivar}>Quitar</button>
        </div>
      </div>

      {(modulo.ancho || modulo.alto || modulo.profundidad) && (
        <p className={styles.medidas}>
          {modulo.ancho} x {modulo.alto} x {modulo.profundidad} mm
        </p>
      )}

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Piezas</span>
          <span className={styles.statVal}>{modulo.piezas?.length ?? 0}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>m2 placa</span>
          <span className={styles.statVal}>{m2Total}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>m. canto</span>
          <span className={styles.statVal}>{metrosCanto}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Placas</span>
          <span className={styles.statVal}>{placasNecesarias}</span>
        </div>
      </div>

      {modulo.notas && <p className={styles.notas}>{modulo.notas}</p>}
    </div>
  )
}
