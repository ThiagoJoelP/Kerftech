import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getMateriales } from '@/services/materiales'
import { getModulos } from '@/services/modulos'
import { calcularPresupuesto, calcularTotalFinal } from '@/utils/presupuesto'
import { uid } from '@/utils/calculos'
import SelectorModulos from './SelectorModulos'
import ResumenPresupuesto from './ResumenPresupuesto'
import styles from './EditorProyecto.module.css'

const ESTADOS = ['borrador', 'presupuestado', 'confirmado', 'en_produccion', 'entregado']

function initForm(proyecto) {
  return {
    nombre: proyecto?.nombre ?? '',
    cliente: proyecto?.cliente ?? '',
    estado: proyecto?.estado ?? 'borrador',
    notas: proyecto?.notas ?? '',
    porcentajeGanancia: proyecto?.porcentajeGanancia ?? 40,
    montoManoObra: proyecto?.montoManoObra ?? 0,
  }
}

export default function EditorProyecto({ proyecto, onGuardar, onCancelar }) {
  const { user } = useAuth()
  const [form, setForm] = useState(() => initForm(proyecto))
  const [items, setItems] = useState(proyecto?.items ?? [])
  const [modulos, setModulos] = useState([])
  const [materiales, setMateriales] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState('')
  const [mostrarSelector, setMostrarSelector] = useState(false)

  useEffect(() => {
    async function cargarDatos() {
      const [mods, mats] = await Promise.all([
        getModulos(user.uid),
        getMateriales(user.uid),
      ])
      setModulos(mods)
      setMateriales(mats)
      setCargando(false)
    }
    cargarDatos()
  }, [user.uid])

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // Armar snapshots al agregar un modulo
  const agregarModulo = (modulo) => {
    const placaSnap = materiales.find((m) => m.id === modulo.tipoPlacaId) ?? null
    const cantoDefault = materiales.find((m) => m.tipo === 'canto') ?? null

    const herrajesConSnap = (modulo.herrajes ?? []).map((h) => ({
      ...h,
      snap: materiales.find((m) => m.id === h.materialId) ?? null,
    }))

    const moduloSnap = {
      ...modulo,
      placaSnap: placaSnap ? { nombre: placaSnap.nombre, precio: placaSnap.precio } : null,
      cantoId: cantoDefault?.id ?? null,
      cantoSnap: cantoDefault ? { nombre: cantoDefault.nombre, precio: cantoDefault.precio } : null,
      herrajes: herrajesConSnap,
    }

    setItems((prev) => [...prev, { _id: uid(), moduloId: modulo.id, moduloSnap, cantidad: 1 }])
    setMostrarSelector(false)
  }

  const actualizarCantidad = (id, cant) => {
    setItems((prev) => prev.map((i) => i._id === id ? { ...i, cantidad: Math.max(1, cant) } : i))
  }

  const quitarItem = (id) => setItems((prev) => prev.filter((i) => i._id !== id))

  const { lineas, totalMateriales } = useMemo(() => calcularPresupuesto(items), [items])
  const totales = useMemo(
    () => calcularTotalFinal(totalMateriales, form.porcentajeGanancia, form.montoManoObra),
    [totalMateriales, form.porcentajeGanancia, form.montoManoObra]
  )

  const handleGuardar = async () => {
    if (!form.nombre.trim()) { setErrorGuardar('El nombre es obligatorio.'); return }
    setGuardando(true)
    setErrorGuardar('')
    const itemsLimpios = items.map(({ _id, ...i }) => i)
    await onGuardar({
      nombre: form.nombre.trim(),
      cliente: form.cliente.trim(),
      estado: form.estado,
      notas: form.notas.trim(),
      porcentajeGanancia: Number(form.porcentajeGanancia),
      montoManoObra: Number(form.montoManoObra),
      items: itemsLimpios,
      totalMateriales: totales.totalMateriales,
      totalFinal: totales.totalFinal,
    })
    setGuardando(false)
  }

  if (cargando) return <p className={styles.estado}>Cargando datos...</p>

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <h1>{proyecto ? proyecto.nombre || 'Editar proyecto' : 'Nuevo proyecto'}</h1>
        <div className={styles.headerActions}>
          <button className={styles.btnCancelar} onClick={onCancelar}>Cancelar</button>
          <button className={styles.btnGuardar} onClick={handleGuardar} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar proyecto'}
          </button>
        </div>
      </div>

      {errorGuardar && <p className={styles.error}>{errorGuardar}</p>}

      {/* Datos generales */}
      <div className={styles.seccion}>
        <h2>Datos del proyecto</h2>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>Nombre *</label>
            <input value={form.nombre} onChange={(e) => setField('nombre', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>Cliente</label>
            <input value={form.cliente} onChange={(e) => setField('cliente', e.target.value)} placeholder="Opcional" />
          </div>
          <div className={styles.field}>
            <label>Estado</label>
            <select value={form.estado} onChange={(e) => setField('estado', e.target.value)}>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label>Notas</label>
            <textarea value={form.notas} onChange={(e) => setField('notas', e.target.value)} rows={2} placeholder="Opcional" />
          </div>
        </div>
      </div>

      {/* Modulos del proyecto */}
      <div className={styles.seccion}>
        <div className={styles.seccionHeader}>
          <h2>Modulos</h2>
          <button className={styles.btnAgregarModulo} onClick={() => setMostrarSelector(true)}>
            + Agregar modulo
          </button>
        </div>

        {mostrarSelector && (
          <SelectorModulos
            modulos={modulos}
            onSeleccionar={agregarModulo}
            onCerrar={() => setMostrarSelector(false)}
          />
        )}

        {items.length === 0 ? (
          <p className={styles.sinItems}>No hay modulos en este proyecto.</p>
        ) : (
          <div className={styles.itemsLista}>
            {items.map((item) => (
              <div key={item._id} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemNombre}>{item.moduloSnap?.nombre ?? 'Modulo'}</span>
                  <span className={styles.itemCat}>{item.moduloSnap?.categoria}</span>
                </div>
                <div className={styles.itemControls}>
                  <label className={styles.itemCantLabel}>Cantidad</label>
                  <input
                    type="number"
                    className={styles.itemCant}
                    value={item.cantidad}
                    min={1}
                    onChange={(e) => actualizarCantidad(item._id, Number(e.target.value))}
                  />
                  <button className={styles.itemQuitar} onClick={() => quitarItem(item._id)}>Quitar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mano de obra */}
      <div className={styles.seccion}>
        <h2>Mano de obra</h2>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>% Ganancia sobre materiales</label>
            <input
              type="number"
              value={form.porcentajeGanancia}
              min={0}
              onChange={(e) => setField('porcentajeGanancia', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Monto fijo adicional ($)</label>
            <input
              type="number"
              value={form.montoManoObra}
              min={0}
              onChange={(e) => setField('montoManoObra', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Resumen */}
      <ResumenPresupuesto lineas={lineas} totales={totales} />
    </div>
  )
}
