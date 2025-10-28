'use client';

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

// Keep `initializeFirebase` for any legacy one-off uses if needed, but it's not the primary way anymore.
import { app } from '@/firebase/config';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export function initializeFirebase() {
    return {
        firebaseApp: app,
        auth: getAuth(app),
        firestore: getFirestore(app),
    };
}
