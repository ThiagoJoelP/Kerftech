import { uid } from '@/utils/calculos'
import styles from './TablaPiezas.module.css'

const PIEZA_DEFAULT = () => ({
  _id: uid(),
  nombre: '',
  cantidad: 1,
  ancho: '',
  largo: '',
  cantoArriba: false,
  cantoAbajo: false,
  cantoIzq: false,
  cantoDer: false,
})

export default function TablaPiezas({ piezas, onChange }) {
  const agregar = () => onChange([...piezas, PIEZA_DEFAULT()])

  const actualizar = (id, key, val) => {
    onChange(piezas.map((p) => p._id === id ? { ...p, [key]: val } : p))
  }

  const eliminar = (id) => onChange(piezas.filter((p) => p._id !== id))

  if (piezas.length === 0) {
    return (
      <div className={styles.vacio}>
        <p>No hay piezas. Agrega la primera pieza del despiece.</p>
        <button className={styles.btnAgregar} onClick={agregar}>+ Agregar pieza</button>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.wrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cant.</th>
              <th>Ancho (mm)</th>
              <th>Largo (mm)</th>
              <th title="Canto Arriba">CA</th>
              <th title="Canto Abajo">CB</th>
              <th title="Canto Izquierda">CI</th>
              <th title="Canto Derecha">CD</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {piezas.map((p) => (
              <tr key={p._id}>
                <td>
                  <input
                    className={styles.inputTexto}
                    value={p.nombre}
                    onChange={(e) => actualizar(p._id, 'nombre', e.target.value)}
                    placeholder="ej: lateral"
                  />
                </td>
                <td>
                  <input
                    className={styles.inputNumero}
                    type="number"
                    value={p.cantidad}
                    min={1}
                    onChange={(e) => actualizar(p._id, 'cantidad', Number(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    className={styles.inputNumero}
                    type="number"
                    value={p.ancho}
                    min={0}
                    onChange={(e) => actualizar(p._id, 'ancho', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className={styles.inputNumero}
                    type="number"
                    value={p.largo}
                    min={0}
                    onChange={(e) => actualizar(p._id, 'largo', e.target.value)}
                  />
                </td>
                {['cantoArriba', 'cantoAbajo', 'cantoIzq', 'cantoDer'].map((key) => (
                  <td key={key} className={styles.tdCheck}>
                    <input
                      type="checkbox"
                      checked={!!p[key]}
                      onChange={(e) => actualizar(p._id, key, e.target.checked)}
                    />
                  </td>
                ))}
                <td>
                  <button className={styles.btnEliminar} onClick={() => eliminar(p._id)}>x</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className={styles.btnAgregar} onClick={agregar}>+ Agregar pieza</button>
    </div>
  )
}
