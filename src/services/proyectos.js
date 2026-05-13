import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/config'

function proyectosRef(userId) {
  return collection(db, 'users', userId, 'proyectos')
}

export async function getProyectos(userId) {
  const q = query(proyectosRef(userId), where('eliminado', '==', false))
  const snap = await getDocs(q)
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return docs.sort((a, b) => {
    const ta = a.actualizadoEn?.toMillis?.() ?? 0
    const tb = b.actualizadoEn?.toMillis?.() ?? 0
    return tb - ta // mas reciente primero
  })
}

export async function getProyecto(userId, proyectoId) {
  const ref = doc(db, 'users', userId, 'proyectos', proyectoId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function addProyecto(userId, data) {
  return addDoc(proyectosRef(userId), {
    ...data,
    eliminado: false,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  })
}

export async function updateProyecto(userId, proyectoId, data) {
  const ref = doc(db, 'users', userId, 'proyectos', proyectoId)
  return updateDoc(ref, {
    ...data,
    actualizadoEn: serverTimestamp(),
  })
}

export async function eliminarProyecto(userId, proyectoId) {
  const ref = doc(db, 'users', userId, 'proyectos', proyectoId)
  return updateDoc(ref, { eliminado: true, actualizadoEn: serverTimestamp() })
}
