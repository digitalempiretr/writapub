'use client';

import { useState, useEffect } from 'react';
import { Auth, User, onAuthStateChanged, IdTokenResult } from 'firebase/auth';

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

export function useUser(auth: Auth): UserHookResult {
  const [userState, setUserState] = useState<UserHookResult>({
    user: auth.currentUser,
    isUserLoading: true,
    userError: null,
    claims: null,
    idToken: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            const idTokenResult: IdTokenResult = await user.getIdTokenResult(true); // Force refresh
            const claims: CustomClaims = (idTokenResult.claims as CustomClaims) || {};
            setUserState({
              user,
              isUserLoading: false,
              userError: null,
              claims,
              idToken: idTokenResult.token,
            });
          } catch (error) {
            console.error("Error getting user token/claims:", error);
            setUserState({
              user,
              isUserLoading: false,
              userError: error instanceof Error ? error : new Error('Failed to get token'),
              claims: null,
              idToken: null,
            });
          }
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

    return () => unsubscribe();
  }, [auth]);

  return userState;
}
