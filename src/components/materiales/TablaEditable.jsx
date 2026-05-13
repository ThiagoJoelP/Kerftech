import { useState } from 'react'
import styles from './TablaEditable.module.css'

export default function TablaEditable({ items, loading, campos, onUpdate, onDesactivar, emptyMsg }) {
  const [editando, setEditando] = useState(null) // { id, campo }
  const [valorEdit, setValorEdit] = useState('')
  const [guardando, setGuardando] = useState(false)

  const iniciarEdicion = (item, campo) => {
    setEditando({ id: item.id, campo: campo.key })
    setValorEdit(item[campo.key] ?? '')
  }

  const confirmarEdicion = async (item, campo) => {
    if (guardando) return
    const valorFinal = campo.tipo === 'numero' ? Number(valorEdit) : valorEdit
    if (valorFinal === item[campo.key]) {
      setEditando(null)
      return
    }
    setGuardando(true)
    await onUpdate(item.id, { [campo.key]: valorFinal })
    setEditando(null)
    setGuardando(false)
  }

  const handleKeyDown = (e, item, campo) => {
    if (e.key === 'Enter') confirmarEdicion(item, campo)
    if (e.key === 'Escape') setEditando(null)
  }

  if (loading) return <p className={styles.estado}>Cargando...</p>
  if (!items.length) return <p className={styles.estado}>{emptyMsg}</p>

  return (
    <div className={styles.wrapper}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            {campos.map((c) => <th key={c.key}>{c.label}</th>)}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {campos.map((campo) => {
                const estaEditando = editando?.id === item.id && editando?.campo === campo.key
                return (
                  <td key={campo.key} onClick={() => !estaEditando && iniciarEdicion(item, campo)}>
                    {estaEditando ? (
                      campo.tipo === 'select' ? (
                        <select
                          autoFocus
                          value={valorEdit}
                          onChange={(e) => setValorEdit(e.target.value)}
                          onBlur={() => confirmarEdicion(item, campo)}
                          className={styles.inputEdit}
                        >
                          {campo.opciones.map((o) => (
                            <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          autoFocus
                          type={campo.tipo === 'numero' ? 'number' : 'text'}
                          value={valorEdit}
                          onChange={(e) => setValorEdit(e.target.value)}
                          onBlur={() => confirmarEdicion(item, campo)}
                          onKeyDown={(e) => handleKeyDown(e, item, campo)}
                          className={styles.inputEdit}
                          min={0}
                        />
                      )
                    ) : (
                      <span className={styles.celda}>
                        {campo.tipo === 'numero' && campo.key === 'precio'
                          ? `$${Number(item[campo.key]).toLocaleString('es-AR')}`
                          : item[campo.key] ?? '-'}
                      </span>
                    )}
                  </td>
                )
              })}
              <td>
                <button
                  className={styles.btnEliminar}
                  onClick={() => onDesactivar(item.id)}
                  title="Desactivar"
                >
                  Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
