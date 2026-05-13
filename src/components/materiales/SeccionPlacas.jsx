import { useState } from 'react'
import { useMateriales } from '@/hooks/useMateriales'
import TablaEditable from './TablaEditable'
import styles from './SeccionMaterial.module.css'

const CAMPOS_PLACA = [
  { key: 'nombre', label: 'Nombre', tipo: 'texto' },
  { key: 'ancho', label: 'Ancho (mm)', tipo: 'numero' },
  { key: 'alto', label: 'Alto (mm)', tipo: 'numero' },
  { key: 'espesor', label: 'Espesor (mm)', tipo: 'numero', defaultValue: 18 },
  { key: 'precio', label: 'Precio por placa', tipo: 'numero' },
]

const NUEVO_DEFAULT = { nombre: '', ancho: 2440, alto: 1830, espesor: 18, precio: '' }

export default function SeccionPlacas() {
  const { items, loading, error, agregar, actualizar, desactivar } = useMateriales('placa')
  const [nuevo, setNuevo] = useState(NUEVO_DEFAULT)
  const [agregando, setAgregando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const handleAgregar = async () => {
    if (!nuevo.nombre || !nuevo.precio) return
    setGuardando(true)
    await agregar({
      nombre: nuevo.nombre,
      ancho: Number(nuevo.ancho),
      alto: Number(nuevo.alto),
      espesor: Number(nuevo.espesor),
      precio: Number(nuevo.precio),
    })
    setNuevo(NUEVO_DEFAULT)
    setAgregando(false)
    setGuardando(false)
  }

  return (
    <div className={styles.seccion}>
      <div className={styles.header}>
        <h2>Placas</h2>
        <button className={styles.btnAgregar} onClick={() => setAgregando(true)}>
          + Nueva placa
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {agregando && (
        <div className={styles.formNuevo}>
          {CAMPOS_PLACA.map((c) => (
            <div key={c.key} className={styles.formField}>
              <label>{c.label}</label>
              <input
                type={c.tipo === 'numero' ? 'number' : 'text'}
                value={nuevo[c.key]}
                onChange={(e) => setNuevo((p) => ({ ...p, [c.key]: e.target.value }))}
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
        campos={CAMPOS_PLACA}
        onUpdate={actualizar}
        onDesactivar={desactivar}
        emptyMsg="No hay placas cargadas."
      />
    </div>
  )
}
