'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { useUser as useUserFromHook, UserHookResult } from './auth/use-user'; // Renamed import

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export interface FirebaseContextState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const { user, isUserLoading, userError } = useUserFromHook(auth); // Use the dedicated hook

  const contextValue = useMemo((): FirebaseContextState => {
    return {
      firebaseApp,
      firestore,
      auth,
      user,
      isUserLoading,
      userError,
    };
  }, [firebaseApp, firestore, auth, user, isUserLoading, userError]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

function useFirebaseInternal(): FirebaseContextState {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseInternal must be used within a FirebaseProvider.');
  }
  return context;
}

export const useAuth = (): Auth => useFirebaseInternal().auth;
export const useFirestore = (): Firestore => useFirebaseInternal().firestore;
export const useFirebaseApp = (): FirebaseApp => useFirebaseInternal().firebaseApp;
export const useUser = (): UserHookResult => {
    const { user, isUserLoading, userError } = useFirebaseInternal();
    return { user, isUserLoading, userError };
};
