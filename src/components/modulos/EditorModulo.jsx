import { useState } from 'react'
import { calcularModulo, uid } from '@/utils/calculos'
import TablaPiezas from './TablaPiezas'
import TablaHerrajesModulo from './TablaHerrajesModulo'
import styles from './EditorModulo.module.css'

const CATEGORIAS = ['cocina', 'placard', 'banio', 'living', 'otro']

function initForm(modulo) {
  if (!modulo) return {
    nombre: '', categoria: 'cocina', tipo: 'estandar',
    ancho: '', alto: '', profundidad: '',
    tipoPlacaId: '', notas: '',
  }
  return {
    nombre: modulo.nombre ?? '',
    categoria: modulo.categoria ?? 'cocina',
    tipo: modulo.tipo ?? 'estandar',
    ancho: modulo.ancho ?? '',
    alto: modulo.alto ?? '',
    profundidad: modulo.profundidad ?? '',
    tipoPlacaId: modulo.tipoPlacaId ?? '',
    notas: modulo.notas ?? '',
  }
}

function initPiezas(modulo) {
  if (!modulo?.piezas?.length) return []
  return modulo.piezas.map((p) => ({ ...p, _id: uid() }))
}

function initHerrajesModulo(modulo) {
  if (!modulo?.herrajes?.length) return []
  return modulo.herrajes.map((h) => ({ ...h, _id: uid() }))
}

export default function EditorModulo({ modulo, placas, herrajesDisponibles, onGuardar, onCancelar }) {
  const [form, setForm] = useState(() => initForm(modulo))
  const [piezas, setPiezas] = useState(() => initPiezas(modulo))
  const [herrajesModulo, setHerrajesModulo] = useState(() => initHerrajesModulo(modulo))
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState('')

  const placaSeleccionada = placas.find((p) => p.id === form.tipoPlacaId) ?? null
  const { m2Total, metrosCanto, placasNecesarias } = calcularModulo(piezas, herrajesModulo, placaSeleccionada)

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleGuardar = async () => {
    if (!form.nombre.trim()) { setErrorGuardar('El nombre es obligatorio.'); return }
    setGuardando(true)
    setErrorGuardar('')
    const piezasLimpias = piezas.map(({ _id, ...p }) => p)
    const herrajesLimpios = herrajesModulo.map(({ _id, ...h }) => h)
    await onGuardar({
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      tipo: form.tipo,
      ancho: form.tipo === 'estandar' ? Number(form.ancho) || null : null,
      alto: form.tipo === 'estandar' ? Number(form.alto) || null : null,
      profundidad: form.tipo === 'estandar' ? Number(form.profundidad) || null : null,
      tipoPlacaId: form.tipoPlacaId || null,
      dimensionesPlaca: placaSeleccionada
        ? { ancho: placaSeleccionada.ancho, alto: placaSeleccionada.alto }
        : null,
      notas: form.notas.trim(),
      piezas: piezasLimpias,
      herrajes: herrajesLimpios,
    })
    setGuardando(false)
  }

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <h1>{modulo ? 'Editar modulo' : 'Nuevo modulo'}</h1>
        <div className={styles.headerActions}>
          <button className={styles.btnCancelar} onClick={onCancelar}>Cancelar</button>
          <button className={styles.btnGuardar} onClick={handleGuardar} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar modulo'}
          </button>
        </div>
      </div>

      {errorGuardar && <p className={styles.error}>{errorGuardar}</p>}

      {/* Datos generales */}
      <div className={styles.seccion}>
        <h2>Datos generales</h2>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>Nombre *</label>
            <input value={form.nombre} onChange={(e) => setField('nombre', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>Categoria</label>
            <select value={form.categoria} onChange={(e) => setField('categoria', e.target.value)}>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label>Tipo</label>
            <select value={form.tipo} onChange={(e) => setField('tipo', e.target.value)}>
              <option value="estandar">Estandar</option>
              <option value="a_medida">A medida</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Placa</label>
            <select value={form.tipoPlacaId} onChange={(e) => setField('tipoPlacaId', e.target.value)}>
              <option value="">Sin especificar</option>
              {placas.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          {form.tipo === 'estandar' && (
            <>
              <div className={styles.field}>
                <label>Ancho (mm)</label>
                <input type="number" value={form.ancho} onChange={(e) => setField('ancho', e.target.value)} min={0} />
              </div>
              <div className={styles.field}>
                <label>Alto (mm)</label>
                <input type="number" value={form.alto} onChange={(e) => setField('alto', e.target.value)} min={0} />
              </div>
              <div className={styles.field}>
                <label>Profundidad (mm)</label>
                <input type="number" value={form.profundidad} onChange={(e) => setField('profundidad', e.target.value)} min={0} />
              </div>
            </>
          )}
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label>Notas</label>
            <textarea value={form.notas} onChange={(e) => setField('notas', e.target.value)} rows={2} />
          </div>
        </div>
      </div>

      {/* Despiece */}
      <div className={styles.seccion}>
        <h2>Despiece</h2>
        <TablaPiezas piezas={piezas} onChange={setPiezas} />
      </div>

      {/* Herrajes */}
      <div className={styles.seccion}>
        <h2>Herrajes</h2>
        <TablaHerrajesModulo
          herrajes={herrajesModulo}
          herrajesDisponibles={herrajesDisponibles}
          onChange={setHerrajesModulo}
        />
      </div>

      {/* Resumen calculo */}
      <div className={styles.resumen}>
        <h2>Resumen del modulo</h2>
        <div className={styles.resumenGrid}>
          <div className={styles.resumenItem}>
            <span>m2 de placa</span>
            <strong>{m2Total} m2</strong>
          </div>
          <div className={styles.resumenItem}>
            <span>Metros de canto</span>
            <strong>{metrosCanto} m</strong>
          </div>
          <div className={styles.resumenItem}>
            <span>Placas necesarias (+10% desperdicio)</span>
            <strong>{placasNecesarias}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
