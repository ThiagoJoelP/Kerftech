import { NavLink } from 'react-router-dom'
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

export default function Sidebar() {
  const handleLogout = () => signOut(auth)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Kerftech</div>
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
      <button className={styles.logout} onClick={handleLogout}>
        Cerrar sesion
      </button>
    </aside>
  )
}
