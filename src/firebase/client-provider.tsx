'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { app } from '@/firebase/config'; // Import the singleton app instance
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This component ensures Firebase is initialized once on the client-side
// and provides the initialized services to the rest of the app.
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // Use useMemo to ensure that Firebase services are initialized only once
  // per application lifecycle.
  const firebaseServices = useMemo(() => {
    const authInstance = getAuth(app);
    const firestoreInstance = getFirestore(app);
    return {
      firebaseApp: app,
      auth: authInstance,
      firestore: firestoreInstance,
    };
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
