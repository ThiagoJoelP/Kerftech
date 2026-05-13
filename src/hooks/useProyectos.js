import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getProyectos, addProyecto, updateProyecto, eliminarProyecto } from '@/services/proyectos'

export function useProyectos() {
  const { user } = useAuth()
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProyectos(user.uid)
      setProyectos(data)
    } catch (e) {
      setError('Error al cargar proyectos.')
    } finally {
      setLoading(false)
    }
  }, [user.uid])

  useEffect(() => { cargar() }, [cargar])

  const agregar = async (data) => {
    const ref = await addProyecto(user.uid, data)
    await cargar()
    return ref.id
  }

  const actualizar = async (id, data) => {
    await updateProyecto(user.uid, id, data)
    await cargar()
  }

  const eliminar = async (id) => {
    await eliminarProyecto(user.uid, id)
    await cargar()
  }

  return { proyectos, loading, error, agregar, actualizar, eliminar, recargar: cargar }
}
