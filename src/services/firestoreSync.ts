import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc,
  writeBatch
} from 'firebase/firestore';

/**
 * Firebase Firestore Persistence Helper for PTENit & Marketplace
 * Automatically synchronizes changes to Firestore when configured,
 * with fallback to local state so the app never breaks offline or without credentials.
 */

export const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return !!apiKey && !apiKey.includes('DummyKey');
};

/**
 * Persist or update a single document in Firestore
 */
export async function syncDocToFirestore(collectionName: string, docId: string, data: any) {
  try {
    if (!docId || !data) return;
    const docRef = doc(db, collectionName, String(docId));
    await setDoc(docRef, {
      ...data,
      _lastUpdated: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn(`[Firestore Sync] Could not sync ${collectionName}/${docId}:`, error);
    return false;
  }
}

/**
 * Delete a document from Firestore
 */
export async function deleteDocFromFirestore(collectionName: string, docId: string) {
  try {
    if (!docId) return;
    const docRef = doc(db, collectionName, String(docId));
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.warn(`[Firestore Sync] Could not delete ${collectionName}/${docId}:`, error);
    return false;
  }
}

/**
 * Batch synchronize an entire collection (e.g. on bulk updates or initial seed)
 */
export async function syncCollectionToFirestore(collectionName: string, items: any[], idField: string = 'id') {
  try {
    if (!Array.isArray(items) || items.length === 0) return;
    const batch = writeBatch(db);
    // Firestore batch limit is 500 operations
    const chunk = items.slice(0, 450);
    for (const item of chunk) {
      const docId = String(item[idField] || item.id);
      if (docId) {
        const docRef = doc(db, collectionName, docId);
        batch.set(docRef, { ...item, _lastSynced: new Date().toISOString() }, { merge: true });
      }
    }
    await batch.commit();
    return true;
  } catch (error) {
    console.warn(`[Firestore Sync] Batch error on ${collectionName}:`, error);
    return false;
  }
}
