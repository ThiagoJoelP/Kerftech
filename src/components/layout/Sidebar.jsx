import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'
import styles from './Sidebar.module.css'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/modulos', label: 'Modulos' },
  { to: '/materiales', label: 'Materiales' },
  { to: '/configuracion', label: 'Configuracion' },
]

export default function Sidebar({ open, onClose }) {
  const location = useLocation()

  // Cerrar al navegar en mobile
  useEffect(() => {
    onClose?.()
  }, [location.pathname])

  const handleLogout = () => signOut(auth)

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <div className={styles.logoWrap}>
        <div className={styles.logo}>
          <span className={styles.logoAccent} />
          Kerftech
        </div>
        <button className={styles.btnCerrar} onClick={onClose} aria-label="Cerrar menu">
          &#x2715;
        </button>
      </div>
      <nav className={styles.nav}>
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.logoutWrap}>
        <button className={styles.logout} onClick={handleLogout}>
          Cerrar sesion
        </button>
      </div>
    </aside>
  )
}
