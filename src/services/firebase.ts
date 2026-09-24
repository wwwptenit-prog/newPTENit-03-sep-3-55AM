import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import rawConfig from '../../firebase-applet-config.json';

// Firebase configuration using applet credentials with environment fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || rawConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || rawConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || rawConfig.firestoreDatabaseId
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} catch {
  // Persistence fallback
}

/* CRITICAL: Passing firestoreDatabaseId ensures the correct database instance is targeted */
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const storage: FirebaseStorage = getStorage(app);

// Connection test on boot as recommended in Skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : String(error);
    if (
      error?.code === 'unavailable' ||
      msg.includes('the client is offline') ||
      msg.includes('unavailable') ||
      msg.includes('could not be completed') ||
      msg.includes('Could not reach Cloud Firestore')
    ) {
      console.warn("[Firebase] Client is operating in offline/cached mode until backend is connected.");
    } else {
      console.warn("[Firebase] Connection check status:", msg);
    }
  }
}

if (typeof window !== 'undefined') {
  // Give the browser network stack a brief moment to connect before checking
  setTimeout(() => {
    testConnection();
  }, 1200);
} else {
  testConnection();
}

/**
 * Upload a file/image to Firebase Storage with automatic fallback
 */
export async function uploadFileToStorage(folder: string, fileName: string, file: File | Blob): Promise<string> {
  try {
    const cleanName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const storageRef = ref(storage, `${folder}/${cleanName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.warn(`[Firebase Storage] Could not upload ${fileName} to storage, falling back to base64 reader:`, err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve('https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80');
      reader.readAsDataURL(file);
    });
  }
}

export default app;
