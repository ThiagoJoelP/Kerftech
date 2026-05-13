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

const CANTOS = [
  { key: 'cantoArriba', label: 'Arr. \u2191' },
  { key: 'cantoAbajo',  label: 'Abj. \u2193' },
  { key: 'cantoIzq',   label: 'Izq. \u2190' },
  { key: 'cantoDer',   label: 'Der. \u2192' },
]

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
              {CANTOS.map((c) => (
                <th key={c.key} title={c.key.replace('canto', 'Canto ')}>{c.label}</th>
              ))}
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
                {CANTOS.map((c) => (
                  <td key={c.key} className={styles.tdCheck}>
                    <input
                      type="checkbox"
                      checked={!!p[c.key]}
                      onChange={(e) => actualizar(p._id, c.key, e.target.checked)}
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
