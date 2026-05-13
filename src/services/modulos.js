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

function modulosRef(userId) {
  return collection(db, 'users', userId, 'modulos')
}

export async function getModulos(userId) {
  const q = query(modulosRef(userId), where('activo', '==', true))
  const snap = await getDocs(q)
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return docs.sort((a, b) => {
    const ta = a.creadoEn?.toMillis?.() ?? 0
    const tb = b.creadoEn?.toMillis?.() ?? 0
    return ta - tb
  })
}

export async function getModulo(userId, moduloId) {
  const ref = doc(db, 'users', userId, 'modulos', moduloId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function addModulo(userId, data) {
  return addDoc(modulosRef(userId), {
    ...data,
    activo: true,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  })
}

export async function updateModulo(userId, moduloId, data) {
  const ref = doc(db, 'users', userId, 'modulos', moduloId)
  return updateDoc(ref, {
    ...data,
    actualizadoEn: serverTimestamp(),
  })
}

export async function desactivarModulo(userId, moduloId) {
  const ref = doc(db, 'users', userId, 'modulos', moduloId)
  return updateDoc(ref, { activo: false, actualizadoEn: serverTimestamp() })
}
