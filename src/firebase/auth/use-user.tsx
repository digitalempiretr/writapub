'use client';

import { useState, useEffect } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, Firestore } from 'firebase/firestore';

export interface CustomClaims {
  role?: 'admin' | 'user';
  [key: string]: any;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  claims: CustomClaims | null;
  idToken: string | null;
}

export function useUser(auth: Auth, firestore: Firestore): UserHookResult {
  const [userState, setUserState] = useState<UserHookResult>({
    user: auth.currentUser,
    isUserLoading: true,
    userError: null,
    claims: null,
    idToken: null,
  });

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          const userDocRef = doc(firestore, 'users', user.uid);
          
          const docUnsubscribe = onSnapshot(userDocRef, 
            (docSnap) => {
              if (docSnap.exists()) {
                const userData = docSnap.data();
                const claims: CustomClaims = { role: userData.role || 'user' };
                setUserState({
                  user,
                  isUserLoading: false,
                  userError: null,
                  claims,
                  idToken: null,
                });
              } else {
                 setUserState({
                  user,
                  isUserLoading: false,
                  userError: null,
                  claims: { role: 'user' },
                  idToken: null,
                });
              }
            }, 
            (error) => {
              console.error("Error fetching user document for claims:", error);
              setUserState({
                user,
                isUserLoading: false,
                userError: error,
                claims: null,
                idToken: null,
              });
            }
          );
          
          return () => docUnsubscribe();

        } else {
          setUserState({
            user: null,
            isUserLoading: false,
            userError: null,
            claims: null,
            idToken: null,
          });
        }
      },
      (error) => {
        console.error("useUser hook onAuthStateChanged error:", error);
        setUserState({
          user: null,
          isUserLoading: false,
          userError: error,
          claims: null,
          idToken: null,
        });
      }
    );

    return () => authUnsubscribe();
  }, [auth, firestore]);

  return userState;
}
