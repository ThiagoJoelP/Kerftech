import { useState } from 'react'
import { useMateriales } from '@/hooks/useMateriales'
import TablaEditable from './TablaEditable'
import styles from './SeccionMaterial.module.css'

const CATEGORIAS = ['guia', 'bisagra', 'perfil', 'manija', 'otro']
const UNIDADES = ['unidad', 'par', 'metro']

const CAMPOS_HERRAJE = [
  { key: 'nombre', label: 'Nombre', tipo: 'texto' },
  { key: 'categoria', label: 'Categoria', tipo: 'select', opciones: CATEGORIAS },
  { key: 'descripcion', label: 'Descripcion / Variante', tipo: 'texto' },
  { key: 'unidad', label: 'Unidad', tipo: 'select', opciones: UNIDADES },
  { key: 'precio', label: 'Precio unitario', tipo: 'numero' },
]

const NUEVO_DEFAULT = { nombre: '', categoria: 'guia', descripcion: '', unidad: 'unidad', precio: '' }

export default function SeccionHerrajes() {
  const { items, loading, error, agregar, actualizar, desactivar } = useMateriales('herraje')
  const [nuevo, setNuevo] = useState(NUEVO_DEFAULT)
  const [agregando, setAgregando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState('todas')

  const handleAgregar = async () => {
    if (!nuevo.nombre || !nuevo.precio) return
    setGuardando(true)
    await agregar({
      nombre: nuevo.nombre,
      categoria: nuevo.categoria,
      descripcion: nuevo.descripcion,
      unidad: nuevo.unidad,
      precio: Number(nuevo.precio),
    })
    setNuevo(NUEVO_DEFAULT)
    setAgregando(false)
    setGuardando(false)
  }

  const itemsFiltrados = filtroCategoria === 'todas'
    ? items
    : items.filter((i) => i.categoria === filtroCategoria)

  return (
    <div className={styles.seccion}>
      <div className={styles.header}>
        <h2>Herrajes</h2>
        <div className={styles.headerActions}>
          <select
            className={styles.filtro}
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="todas">Todas las categorias</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <button className={styles.btnAgregar} onClick={() => setAgregando(true)}>
            + Nuevo herraje
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {agregando && (
        <div className={styles.formNuevo}>
          {CAMPOS_HERRAJE.map((c) => (
            <div key={c.key} className={styles.formField}>
              <label>{c.label}</label>
              {c.tipo === 'select' ? (
                <select
                  value={nuevo[c.key]}
                  onChange={(e) => setNuevo((p) => ({ ...p, [c.key]: e.target.value }))}
                >
                  {c.opciones.map((o) => (
                    <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={c.tipo === 'numero' ? 'number' : 'text'}
                  value={nuevo[c.key]}
                  onChange={(e) => setNuevo((p) => ({ ...p, [c.key]: e.target.value }))}
                  min={0}
                />
              )}
            </div>
          ))}
          <div className={styles.formActions}>
            <button className={styles.btnGuardar} onClick={handleAgregar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <button className={styles.btnCancelar} onClick={() => setAgregando(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <TablaEditable
        items={itemsFiltrados}
        loading={loading}
        campos={CAMPOS_HERRAJE}
        onUpdate={actualizar}
        onDesactivar={desactivar}
        emptyMsg="No hay herrajes cargados."
      />
    </div>
  )
}
