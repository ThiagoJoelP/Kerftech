import { useState } from 'react'
import { useModulos } from '@/hooks/useModulos'
import { getMateriales } from '@/services/materiales'
import { useAuth } from '@/context/AuthContext'
import ModuloCard from './ModuloCard'
import EditorModulo from './EditorModulo'
import styles from './ListaModulos.module.css'

const CATEGORIAS = ['cocina', 'placard', 'banio', 'living', 'otro']

export default function ListaModulos() {
  const { user } = useAuth()
  const { modulos, loading, error, agregar, actualizar, desactivar } = useModulos()
  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [editando, setEditando] = useState(null) // null | 'nuevo' | { modulo }
  const [placas, setPlacas] = useState(null)
  const [herrajes, setHerrajes] = useState(null)

  const abrirEditor = async (modulo = null) => {
    if (!placas) {
      const mats = await getMateriales(user.uid)
      setPlacas(mats.filter((m) => m.tipo === 'placa'))
      setHerrajes(mats.filter((m) => m.tipo === 'herraje'))
    }
    setEditando(modulo ?? 'nuevo')
  }

  const handleGuardar = async (data) => {
    if (editando === 'nuevo') {
      await agregar(data)
    } else {
      await actualizar(editando.id, data)
    }
    setEditando(null)
  }

  const modulosFiltrados = modulos.filter((m) => {
    const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = filtroCategoria === 'todas' || m.categoria === filtroCategoria
    return coincideBusqueda && coincideCategoria
  })

  if (editando !== null) {
    return (
      <EditorModulo
        modulo={editando === 'nuevo' ? null : editando}
        placas={placas ?? []}
        herrajesDisponibles={herrajes ?? []}
        onGuardar={handleGuardar}
        onCancelar={() => setEditando(null)}
      />
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Modulos</h1>
        <button className={styles.btnNuevo} onClick={() => abrirEditor()}>
          + Nuevo modulo
        </button>
      </div>

      <div className={styles.filtros}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={styles.buscador}
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className={styles.filtroSelect}
        >
          <option value="todas">Todas las categorias</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p className={styles.estado}>Cargando...</p>
      ) : modulosFiltrados.length === 0 ? (
        <p className={styles.estado}>
          {modulos.length === 0 ? 'No hay modulos creados.' : 'No hay resultados para la busqueda.'}
        </p>
      ) : (
        <div className={styles.grid}>
          {modulosFiltrados.map((m) => (
            <ModuloCard
              key={m.id}
              modulo={m}
              onEditar={() => abrirEditor(m)}
              onDesactivar={() => desactivar(m.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
