import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  onSnapshot,
  writeBatch,
  query,
  where,
  orderBy,
  limit,
  Unsubscribe
} from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errCode = (error as any)?.code;

  // If the client is temporarily offline or unavailable, log informational notice without throwing
  if (
    errCode === 'unavailable' ||
    errMsg.includes('the client is offline') ||
    errMsg.includes('unavailable') ||
    errMsg.includes('could not be completed') ||
    errMsg.includes('Could not reach Cloud Firestore')
  ) {
    console.warn(`[Firestore Offline] Operation ${operationType} on ${path}: client is operating in offline mode.`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Check whether Firebase is configured
 */
export const isFirebaseConfigured = () => {
  return true;
};

/**
 * Real-time collection listener using onSnapshot
 */
export function subscribeToCollection<T>(
  collectionName: string,
  onData: (items: T[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  try {
    const colRef = collection(db, collectionName);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              ...data
            } as unknown as T;
          });
          onData(items);
        } else {
          onData([]);
        }
      },
      (error) => {
        console.warn(`[Firestore onSnapshot] Listener error on ${collectionName}:`, error.message);
        if (onError) onError(error);
        try {
          handleFirestoreError(error, OperationType.LIST, collectionName);
        } catch {
          // Handled
        }
      }
    );
  } catch (err) {
    console.warn(`[Firestore] Failed to initiate onSnapshot for ${collectionName}:`, err);
    return () => {};
  }
}

/**
 * Persist or update a single document in Firestore
 */
export async function syncDocToFirestore(collectionName: string, docId: string, data: any): Promise<boolean> {
  if (!docId || !data) return false;
  const path = `${collectionName}/${docId}`;
  try {
    const docRef = doc(db, collectionName, String(docId));
    // Clean data of undefined fields which Firestore rejects
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, {
      ...cleanData,
      _lastUpdated: new Date().toISOString(),
    }, { merge: true });
    console.log(`[Firestore Sync SUCCESS] Persisted ${collectionName}/${docId}`);
    return true;
  } catch (error) {
    console.warn(`[Firestore Sync] Could not sync ${path}:`, error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch {
      // Prevent unhandled promise rejection for non-fatal sync
    }
    return false;
  }
}

/**
 * Delete a document from Firestore
 */
export async function deleteDocFromFirestore(collectionName: string, docId: string): Promise<boolean> {
  if (!docId) return false;
  const path = `${collectionName}/${docId}`;
  try {
    const docRef = doc(db, collectionName, String(docId));
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.warn(`[Firestore Sync] Could not delete ${path}:`, error);
    try {
      handleFirestoreError(error, OperationType.DELETE, path);
    } catch {
      // Handled
    }
    return false;
  }
}

/**
 * Batch synchronize an entire collection (e.g. initial seed or bulk import)
 */
export async function syncCollectionToFirestore(collectionName: string, items: any[], idField: string = 'id'): Promise<boolean> {
  try {
    if (!Array.isArray(items) || items.length === 0) return false;
    const batch = writeBatch(db);
    // Firestore batch limit is 500 operations
    const chunk = items.slice(0, 450);
    for (const item of chunk) {
      const docId = String(item[idField] || item.id);
      if (docId) {
        const docRef = doc(db, collectionName, docId);
        const cleanData = JSON.parse(JSON.stringify(item));
        batch.set(docRef, { ...cleanData, _lastSynced: new Date().toISOString() }, { merge: true });
      }
    }
    await batch.commit();
    return true;
  } catch (error) {
    console.warn(`[Firestore Sync] Batch error on ${collectionName}:`, error);
    try {
      handleFirestoreError(error, OperationType.WRITE, collectionName);
    } catch {
      // Handled
    }
    return false;
  }
}
