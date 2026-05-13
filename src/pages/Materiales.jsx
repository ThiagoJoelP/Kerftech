import SeccionPlacas from '@/components/materiales/SeccionPlacas'
import SeccionCanto from '@/components/materiales/SeccionCanto'
import SeccionHerrajes from '@/components/materiales/SeccionHerrajes'
import styles from './Materiales.module.css'

export default function Materiales() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Materiales y Precios</h1>
        <p className={styles.hint}>Hace clic en cualquier celda para editar el valor.</p>
      </div>
      <SeccionPlacas />
      <SeccionCanto />
      <SeccionHerrajes />
    </div>
  )
}
