import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, initializeAuth, browserLocalPersistence, indexedDBLocalPersistence, inMemoryPersistence } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

// The custom web app's Firebase configuration coordinates shared by user
export const firebaseConfig = {
  apiKey: "AIzaSyBMqhZ9IV85Tm0vyCKZWZ0NP3EcG8BYnsM",
  authDomain: "fitness-moleculess-b24c4.firebaseapp.com",
  projectId: "fitness-moleculess-b24c4",
  storageBucket: "fitness-moleculess-b24c4.firebasestorage.app",
  messagingSenderId: "598399271195",
  appId: "1:598399271195:web:da875a09d1639b3af6d3be"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Check if storage is supported synchronously to prevent sandboxed iframe security errors
let isLocalStorageSupported = false;
let isIndexedDBSupported = false;

try {
  if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
    const testKey = '__auth_test_safe__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    isLocalStorageSupported = true;
  }
} catch (e) {
  isLocalStorageSupported = false;
}

try {
  if (typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null) {
    // Under sandboxed iframes, indexedDB can be defined but throws SecurityError on open().
    // We strictly avoid setting isIndexedDBSupported to true if we are running in an iframe context.
    const isInIframe = window.self !== window.top;
    if (!isInIframe) {
      const request = window.indexedDB.open('__idb_test_safe__', 1);
      isIndexedDBSupported = true;
    }
  }
} catch (e) {
  isIndexedDBSupported = false;
}

const persistenceArray: any[] = [];
if (isLocalStorageSupported) {
  persistenceArray.push(browserLocalPersistence);
}
if (isIndexedDBSupported) {
  persistenceArray.push(indexedDBLocalPersistence);
}
persistenceArray.push(inMemoryPersistence);

// Initialize Firebase Services with fallback limits to prevent sandboxed iframe security errors
let safeAuth: any;
try {
  safeAuth = initializeAuth(app, {
    persistence: persistenceArray
  });
} catch (err) {
  console.warn("Could not initialize security persistence layer. Falling back to in-memory Auth session.", err);
  try {
    safeAuth = initializeAuth(app, {
      persistence: inMemoryPersistence
    });
  } catch (err2) {
    try {
      safeAuth = getAuth(app);
    } catch (err3) {
      safeAuth = {
        currentUser: null,
        onAuthStateChanged: (cb: any) => {
          cb(null);
          return () => {};
        },
        signOut: () => Promise.resolve()
      } as any;
    }
  }
}

let safeDb: any;
try {
  safeDb = getFirestore(app);
} catch (err) {
  console.error("Firestore initialized failed, using empty mock state database:", err);
  safeDb = {} as any;
}

export const db = safeDb;
export const auth = safeAuth;
export const googleProvider = new GoogleAuthProvider();

// Standard handleFirestoreError defined in skill
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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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


