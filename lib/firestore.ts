import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CollectionType } from '@/types/models';

export async function createItem(type: CollectionType, data: Record<string, unknown>) {
  return addDoc(collection(db, type), {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

export async function updateItem(type: CollectionType, id: string, data: Record<string, unknown>) {
  return updateDoc(doc(db, type, id), data);
}

export async function deleteItem(type: CollectionType, id: string) {
  return deleteDoc(doc(db, type, id));
}

export async function getItems<T>(type: CollectionType) {
  const snapshot = await getDocs(query(collection(db, type), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })) as T[];
}

export function subscribeItems<T>(type: CollectionType, cb: (items: T[]) => void) {
  return onSnapshot(query(collection(db, type), orderBy('createdAt', 'desc')), (snapshot) => {
    cb(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })) as T[]);
  });
}
