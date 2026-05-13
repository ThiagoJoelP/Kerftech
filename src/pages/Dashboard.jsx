import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getProyectos } from '@/services/proyectos'
import { getMateriales } from '@/services/materiales'
import { getModulos } from '@/services/modulos'
import { getConfiguracion } from '@/services/configuracion'
import styles from './Dashboard.module.css'

const ESTADO_LABEL = {
  borrador: 'Borrador',
  presupuestado: 'Presupuestado',
  confirmado: 'Confirmado',
  en_produccion: 'En produccion',
  entregado: 'Entregado',
}

const ESTADO_COLOR = {
  borrador: 'gris',
  presupuestado: 'naranja',
  confirmado: 'verde',
  en_produccion: 'azul',
  entregado: 'oscuro',
}

const fmt = (n) => `$${Math.round(n).toLocaleString('es-AR')}`

export default function Dashboard() {
  const { user } = useAuth()
  const [datos, setDatos] = useState(null)
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      const [proyectos, materiales, modulos, cfg] = await Promise.all([
        getProyectos(user.uid),
        getMateriales(user.uid),
        getModulos(user.uid),
        getConfiguracion(user.uid),
      ])
      setConfig(cfg)

      const totalFacturado = proyectos
        .filter((p) => ['confirmado', 'en_produccion', 'entregado'].includes(p.estado))
        .reduce((acc, p) => acc + (Number(p.totalFinal) || 0), 0)

      const porEstado = {}
      for (const p of proyectos) {
        porEstado[p.estado] = (porEstado[p.estado] || 0) + 1
      }

      const recientes = [...proyectos]
        .sort((a, b) => (b.actualizadoEn?.toMillis?.() ?? 0) - (a.actualizadoEn?.toMillis?.() ?? 0))
        .slice(0, 5)

      setDatos({
        totalProyectos: proyectos.length,
        totalMateriales: materiales.length,
        totalModulos: modulos.length,
        totalFacturado,
        porEstado,
        recientes,
      })
      setLoading(false)
    }
    cargar()
  }, [user.uid])

  if (loading) return <p className={styles.estado}>Cargando...</p>

  const nombreNegocio = config?.nombreNegocio || 'Kerftech'

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{nombreNegocio}</h1>
          <p className={styles.sub}>Panel de control</p>
        </div>
      </div>

      {/* Stats principales */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statDestacado}`}>
          <span className={styles.statLabel}>Total facturado</span>
          <span className={styles.statVal}>{fmt(datos.totalFacturado)}</span>
          <span className={styles.statHint}>proyectos confirmados, en produccion y entregados</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Proyectos</span>
          <span className={styles.statVal}>{datos.totalProyectos}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Modulos</span>
          <span className={styles.statVal}>{datos.totalModulos}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Materiales</span>
          <span className={styles.statVal}>{datos.totalMateriales}</span>
        </div>
      </div>

      <div className={styles.cols}>
        {/* Proyectos por estado */}
        <div className={styles.panel}>
          <p className={styles.panelLabel}>Proyectos por estado</p>
          {Object.keys(ESTADO_LABEL).map((estado) => {
            const cant = datos.porEstado[estado] || 0
            return (
              <div key={estado} className={styles.estadoRow}>
                <span className={`${styles.estadoBadge} ${styles[ESTADO_COLOR[estado]]}`}>
                  {ESTADO_LABEL[estado]}
                </span>
                <span className={styles.estadoCant}>{cant}</span>
              </div>
            )
          })}
        </div>

        {/* Proyectos recientes */}
        <div className={styles.panel}>
          <p className={styles.panelLabel}>Actividad reciente</p>
          {datos.recientes.length === 0 ? (
            <p className={styles.vacio}>No hay proyectos todavia.</p>
          ) : (
            datos.recientes.map((p) => (
              <div key={p.id} className={styles.recienteRow}>
                <div className={styles.recienteInfo}>
                  <span className={styles.recienteNombre}>{p.nombre}</span>
                  {p.cliente && <span className={styles.recienteCliente}>{p.cliente}</span>}
                </div>
                <div className={styles.recienteDerecha}>
                  <span className={`${styles.estadoBadge} ${styles[ESTADO_COLOR[p.estado]]}`}>
                    {ESTADO_LABEL[p.estado] ?? p.estado}
                  </span>
                  {p.totalFinal > 0 && (
                    <span className={styles.recienteTotal}>{fmt(p.totalFinal)}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
