import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/config'

function materialesRef(userId) {
  return collection(db, 'users', userId, 'materiales')
}

export async function getMateriales(userId) {
  const q = query(
    materialesRef(userId),
    where('activo', '==', true)
  )
  const snap = await getDocs(q)
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  // Ordenar en memoria por fecha de creacion (evita indice compuesto en Firestore)
  return docs.sort((a, b) => {
    const ta = a.creadoEn?.toMillis?.() ?? 0
    const tb = b.creadoEn?.toMillis?.() ?? 0
    return ta - tb
  })
}

export async function addMaterial(userId, data) {
  return addDoc(materialesRef(userId), {
    ...data,
    activo: true,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  })
}

export async function updateMaterial(userId, materialId, data) {
  const ref = doc(db, 'users', userId, 'materiales', materialId)
  return updateDoc(ref, {
    ...data,
    actualizadoEn: serverTimestamp(),
  })
}

export async function desactivarMaterial(userId, materialId) {
  const ref = doc(db, 'users', userId, 'materiales', materialId)
  return updateDoc(ref, { activo: false, actualizadoEn: serverTimestamp() })
}
