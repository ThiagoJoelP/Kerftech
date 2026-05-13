import styles from './ResumenPresupuesto.module.css'

const fmt = (n) => `$${Math.round(n).toLocaleString('es-AR')}`

export default function ResumenPresupuesto({ lineas, totales }) {
  return (
    <div className={styles.resumen}>
      <h2>Resumen de materiales</h2>

      {lineas.length === 0 ? (
        <p className={styles.vacio}>Agrega modulos para ver el resumen.</p>
      ) : (
        <div className={styles.tablaWrap}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Material</th>
                <th>Cantidad</th>
                <th>Precio unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {lineas.map((l) => (
                <tr key={l.materialId}>
                  <td>{l.nombre}</td>
                  <td>{l.cantidad} {l.unidad}{l.cantidad !== 1 ? 's' : ''}</td>
                  <td>{fmt(l.precioUnitario)}</td>
                  <td>{fmt(l.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.totales}>
        <div className={styles.fila}>
          <span>Total materiales</span>
          <span>{fmt(totales.totalMateriales)}</span>
        </div>
        {totales.ganancia > 0 && (
          <div className={styles.fila}>
            <span>Ganancia</span>
            <span>{fmt(totales.ganancia)}</span>
          </div>
        )}
        {totales.manoObra > 0 && (
          <div className={styles.fila}>
            <span>Mano de obra adicional</span>
            <span>{fmt(totales.manoObra)}</span>
          </div>
        )}
        <div className={`${styles.fila} ${styles.filaTotal}`}>
          <span>TOTAL FINAL</span>
          <span>{fmt(totales.totalFinal)}</span>
        </div>
      </div>
    </div>
  )
}
