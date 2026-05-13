import { uid } from '@/utils/calculos'
import styles from './TablaHerrajesModulo.module.css'

export default function TablaHerrajesModulo({ herrajes, herrajesDisponibles, onChange }) {
  const agregar = () => {
    const primero = herrajesDisponibles[0]
    if (!primero) return
    onChange([...herrajes, { _id: uid(), materialId: primero.id, cantidad: 1 }])
  }

  const actualizar = (id, key, val) => {
    onChange(herrajes.map((h) => h._id === id ? { ...h, [key]: val } : h))
  }

  const eliminar = (id) => onChange(herrajes.filter((h) => h._id !== id))

  if (herrajesDisponibles.length === 0) {
    return <p className={styles.aviso}>No hay herrajes cargados en Materiales.</p>
  }

  return (
    <div>
      {herrajes.length === 0 ? (
        <p className={styles.aviso}>Este modulo no tiene herrajes asignados.</p>
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Herraje</th>
                <th>Cantidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {herrajes.map((h) => (
                <tr key={h._id}>
                  <td>
                    <select
                      value={h.materialId}
                      onChange={(e) => actualizar(h._id, 'materialId', e.target.value)}
                      className={styles.selectHerraje}
                    >
                      {herrajesDisponibles.map((hd) => (
                        <option key={hd.id} value={hd.id}>
                          {hd.nombre}{hd.descripcion ? ` - ${hd.descripcion}` : ''}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className={styles.inputCant}
                      value={h.cantidad}
                      min={1}
                      onChange={(e) => actualizar(h._id, 'cantidad', Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <button className={styles.btnEliminar} onClick={() => eliminar(h._id)}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className={styles.btnAgregar} onClick={agregar}>+ Agregar herraje</button>
    </div>
  )
}
