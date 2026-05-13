import { useState } from 'react'
import { useMateriales } from '@/hooks/useMateriales'
import TablaEditable from './TablaEditable'
import styles from './SeccionMaterial.module.css'

const CAMPOS_CANTO = [
  { key: 'nombre', label: 'Nombre / Descripcion', tipo: 'texto' },
  { key: 'grosor', label: 'Grosor (mm)', tipo: 'numero', defaultValue: 0.45 },
  { key: 'precio', label: 'Precio por metro', tipo: 'numero' },
]

const NUEVO_DEFAULT = { nombre: '', grosor: 0.45, precio: '' }

export default function SeccionCanto() {
  const { items, loading, error, agregar, actualizar, desactivar } = useMateriales('canto')
  const [nuevo, setNuevo] = useState(NUEVO_DEFAULT)
  const [agregando, setAgregando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const handleAgregar = async () => {
    if (!nuevo.nombre || !nuevo.precio) return
    setGuardando(true)
    await agregar({
      nombre: nuevo.nombre,
      grosor: Number(nuevo.grosor),
      precio: Number(nuevo.precio),
      unidad: 'metro',
    })
    setNuevo(NUEVO_DEFAULT)
    setAgregando(false)
    setGuardando(false)
  }

  return (
    <div className={styles.seccion}>
      <div className={styles.header}>
        <h2>Canto</h2>
        <button className={styles.btnAgregar} onClick={() => setAgregando(true)}>
          + Nuevo canto
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {agregando && (
        <div className={styles.formNuevo}>
          {CAMPOS_CANTO.map((c) => (
            <div key={c.key} className={styles.formField}>
              <label>{c.label}</label>
              <input
                type={c.tipo === 'numero' ? 'number' : 'text'}
                value={nuevo[c.key]}
                onChange={(e) => setNuevo((p) => ({ ...p, [c.key]: e.target.value }))}
                step={c.key === 'grosor' ? '0.01' : undefined}
                min={0}
              />
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
        items={items}
        loading={loading}
        campos={CAMPOS_CANTO}
        onUpdate={actualizar}
        onDesactivar={desactivar}
        emptyMsg="No hay tipos de canto cargados."
      />
    </div>
  )
}
