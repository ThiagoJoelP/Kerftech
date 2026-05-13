import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getMateriales, addMaterial, updateMaterial, desactivarMaterial } from '@/services/materiales'

export function useMateriales(tipo) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const todos = await getMateriales(user.uid)
      setItems(todos.filter((m) => m.tipo === tipo))
    } catch (e) {
      setError('Error al cargar materiales.')
    } finally {
      setLoading(false)
    }
  }, [user.uid, tipo])

  useEffect(() => { cargar() }, [cargar])

  const agregar = async (data) => {
    await addMaterial(user.uid, { ...data, tipo })
    await cargar()
  }

  const actualizar = async (id, data) => {
    await updateMaterial(user.uid, id, data)
    await cargar()
  }

  const desactivar = async (id) => {
    await desactivarMaterial(user.uid, id)
    await cargar()
  }

  return { items, loading, error, agregar, actualizar, desactivar }
}
