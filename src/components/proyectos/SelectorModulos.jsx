import { useState } from 'react'
import styles from './SelectorModulos.module.css'

const CATEGORIAS = ['cocina', 'placard', 'banio', 'living', 'otro']

export default function SelectorModulos({ modulos, onSeleccionar, onCerrar }) {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todas')

  const filtrados = modulos.filter((m) => {
    const coincideNombre = m.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCat = filtro === 'todas' || m.categoria === filtro
    return coincideNombre && coincideCat
  })

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3>Seleccionar modulo</h3>
          <button className={styles.btnCerrar} onClick={onCerrar}>x</button>
        </div>
        <div className={styles.filtros}>
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={styles.buscador}
            autoFocus
          />
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className={styles.filtroSelect}>
            <option value="todas">Todas</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className={styles.lista}>
          {filtrados.length === 0 ? (
            <p className={styles.vacio}>No hay modulos disponibles.</p>
          ) : (
            filtrados.map((m) => (
              <button key={m.id} className={styles.itemModulo} onClick={() => onSeleccionar(m)}>
                <span className={styles.itemNombre}>{m.nombre}</span>
                <span className={styles.itemMeta}>
                  {m.categoria} &middot; {m.tipo} &middot; {m.piezas?.length ?? 0} piezas
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
