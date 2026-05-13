import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getModulos, addModulo, updateModulo, desactivarModulo } from '@/services/modulos'

export function useModulos() {
  const { user } = useAuth()
  const [modulos, setModulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getModulos(user.uid)
      setModulos(data)
    } catch (e) {
      setError('Error al cargar modulos.')
    } finally {
      setLoading(false)
    }
  }, [user.uid])

  useEffect(() => { cargar() }, [cargar])

  const agregar = async (data) => {
    const ref = await addModulo(user.uid, data)
    await cargar()
    return ref.id
  }

  const actualizar = async (id, data) => {
    await updateModulo(user.uid, id, data)
    await cargar()
  }

  const desactivar = async (id) => {
    await desactivarModulo(user.uid, id)
    await cargar()
  }

  return { modulos, loading, error, agregar, actualizar, desactivar, recargar: cargar }
}
