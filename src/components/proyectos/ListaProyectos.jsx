import { useState } from 'react'
import { useProyectos } from '@/hooks/useProyectos'
import ProyectoCard from './ProyectoCard'
import EditorProyecto from './EditorProyecto'
import styles from './ListaProyectos.module.css'

const ESTADOS = ['borrador', 'presupuestado', 'confirmado', 'en_produccion', 'entregado']

export default function ListaProyectos() {
  const { proyectos, loading, error, agregar, actualizar, eliminar } = useProyectos()
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [editando, setEditando] = useState(null) // null | 'nuevo' | { proyecto }

  const handleGuardar = async (data) => {
    if (editando === 'nuevo') {
      await agregar(data)
    } else {
      await actualizar(editando.id, data)
    }
    setEditando(null)
  }

  const proyectosFiltrados = proyectos.filter((p) =>
    filtroEstado === 'todos' || p.estado === filtroEstado
  )

  if (editando !== null) {
    return (
      <EditorProyecto
        proyecto={editando === 'nuevo' ? null : editando}
        onGuardar={handleGuardar}
        onCancelar={() => setEditando(null)}
      />
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Proyectos</h1>
        <button className={styles.btnNuevo} onClick={() => setEditando('nuevo')}>
          + Nuevo proyecto
        </button>
      </div>

      <div className={styles.filtros}>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className={styles.filtroSelect}
        >
          <option value="todos">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{e.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p className={styles.estado}>Cargando...</p>
      ) : proyectosFiltrados.length === 0 ? (
        <p className={styles.estado}>
          {proyectos.length === 0 ? 'No hay proyectos creados.' : 'No hay proyectos con ese estado.'}
        </p>
      ) : (
        <div className={styles.lista}>
          {proyectosFiltrados.map((p) => (
            <ProyectoCard
              key={p.id}
              proyecto={p}
              onEditar={() => setEditando(p)}
              onEliminar={() => eliminar(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
