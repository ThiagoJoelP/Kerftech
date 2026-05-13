import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export async function getConfiguracion(userId) {
  const ref = doc(db, 'users', userId, 'configuracion', 'default')
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data()
}

export async function saveConfiguracion(userId, data) {
  const ref = doc(db, 'users', userId, 'configuracion', 'default')
  return setDoc(ref, {
    ...data,
    actualizadoEn: serverTimestamp(),
  }, { merge: true })
}
