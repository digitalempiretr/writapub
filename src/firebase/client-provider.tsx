'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { app } from '@/firebase/config'; // Import the singleton app instance
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // Services are derived from the single app instance.
  // useMemo ensures they are only created once per component lifecycle.
  const firebaseServices = useMemo(() => {
    return {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: getFirestore(app),
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
