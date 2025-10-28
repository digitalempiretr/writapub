'use client';

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

// This file serves as a barrel file for easy imports.
// The main initialization logic is now handled in config.ts and client-provider.tsx
// to ensure a singleton pattern.
import { app } from '@/firebase/config';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * @deprecated This function is deprecated. Firebase services should be accessed via context hooks like useAuth() and useFirestore() to ensure a single instance is used.
 */
export function initializeFirebase() {
    return {
        firebaseApp: app,
        auth: getAuth(app),
        firestore: getFirestore(app),
    };
}
