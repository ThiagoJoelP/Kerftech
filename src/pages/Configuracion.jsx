import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getConfiguracion, saveConfiguracion } from '@/services/configuracion'
import styles from './Configuracion.module.css'

const DEFAULTS = {
  nombreNegocio: '',
  nombreCarpintero: '',
  telefono: '',
  email: '',
  porcentajeGananciaDefault: 40,
  moneda: 'ARS',
  notaPresupuesto: '',
}

export default function Configuracion() {
  const { user } = useAuth()
  const [form, setForm] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    async function cargar() {
      const data = await getConfiguracion(user.uid)
      if (data) setForm((f) => ({ ...f, ...data }))
      setLoading(false)
    }
    cargar()
  }, [user.uid])

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setGuardado(false)
  }

  const handleGuardar = async () => {
    setGuardando(true)
    await saveConfiguracion(user.uid, form)
    setGuardando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
  }

  if (loading) return <p className={styles.estado}>Cargando...</p>

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Configuracion</h1>
        <button
          className={`${styles.btnGuardar} ${guardado ? styles.guardado : ''}`}
          onClick={handleGuardar}
          disabled={guardando}
        >
          {guardando ? 'Guardando...' : guardado ? 'Guardado' : 'Guardar cambios'}
        </button>
      </div>

      <div className={styles.seccion}>
        <p className={styles.seccionLabel}>Datos del negocio</p>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>Nombre del negocio</label>
            <input
              type="text"
              value={form.nombreNegocio}
              onChange={(e) => setField('nombreNegocio', e.target.value)}
              placeholder="Ej: Carpinteria Martinez"
            />
          </div>
          <div className={styles.field}>
            <label>Nombre del carpintero</label>
            <input
              type="text"
              value={form.nombreCarpintero}
              onChange={(e) => setField('nombreCarpintero', e.target.value)}
              placeholder="Ej: Juan Martinez"
            />
          </div>
          <div className={styles.field}>
            <label>Telefono</label>
            <input
              type="text"
              value={form.telefono}
              onChange={(e) => setField('telefono', e.target.value)}
              placeholder="Ej: +54 351 000-0000"
            />
          </div>
          <div className={styles.field}>
            <label>Email de contacto</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="Ej: contacto@carpinteria.com"
            />
          </div>
        </div>
      </div>

      <div className={styles.seccion}>
        <p className={styles.seccionLabel}>Preferencias de presupuesto</p>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>% Ganancia por defecto</label>
            <input
              type="number"
              value={form.porcentajeGananciaDefault}
              min={0}
              max={200}
              onChange={(e) => setField('porcentajeGananciaDefault', Number(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label>Moneda</label>
            <select value={form.moneda} onChange={(e) => setField('moneda', e.target.value)}>
              <option value="ARS">ARS - Peso argentino</option>
              <option value="USD">USD - Dolar</option>
              <option value="UYU">UYU - Peso uruguayo</option>
            </select>
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label>Nota al pie del presupuesto</label>
            <textarea
              value={form.notaPresupuesto}
              onChange={(e) => setField('notaPresupuesto', e.target.value)}
              rows={3}
              placeholder="Ej: Presupuesto valido por 15 dias. Precios sujetos a variacion."
            />
          </div>
        </div>
      </div>

      <div className={styles.seccion}>
        <p className={styles.seccionLabel}>Cuenta</p>
        <div className={styles.cuentaInfo}>
          <span className={styles.cuentaLabel}>Usuario</span>
          <span className={styles.cuentaVal}>{user.email}</span>
        </div>
      </div>
    </div>
  )
}
