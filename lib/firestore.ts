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

function requireDb() {
  if (!db) {
    throw new Error('Firestore is not configured. Set NEXT_PUBLIC_FIREBASE_* environment variables.');
  }
  return db;
}

export async function createItem(type: CollectionType, data: Record<string, unknown>) {
  const firestore = requireDb();
  return addDoc(collection(firestore, type), {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

export async function updateItem(type: CollectionType, id: string, data: Record<string, unknown>) {
  const firestore = requireDb();
  return updateDoc(doc(firestore, type, id), data);
}

export async function deleteItem(type: CollectionType, id: string) {
  const firestore = requireDb();
  return deleteDoc(doc(firestore, type, id));
}

export async function getItems<T>(type: CollectionType) {
  const firestore = requireDb();
  const snapshot = await getDocs(query(collection(firestore, type), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })) as T[];
}

export function subscribeItems<T>(type: CollectionType, cb: (items: T[]) => void) {
  if (!db) {
    cb([]);
    return () => undefined;
  }

  return onSnapshot(query(collection(db, type), orderBy('createdAt', 'desc')), (snapshot) => {
    cb(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })) as T[]);
  });
}
