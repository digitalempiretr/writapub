'use client';

import { useState, useEffect } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '..'; // Import useFirestore

export interface CustomClaims {
  role?: 'admin' | 'user';
  [key: string]: any;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  claims: CustomClaims | null;
  idToken: string | null; // Kept for type consistency, but will be null
}

export function useUser(auth: Auth): UserHookResult {
  const firestore = useFirestore(); // Get firestore instance from context
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
          // If a user is authenticated, listen for changes to their document in Firestore
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
                  idToken: null, // We are not handling ID token directly here anymore
                });
              } else {
                // This case might happen briefly if the user doc hasn't been created yet.
                // We'll set a default 'user' role.
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
                claims: null, // Could set to a default/error state
                idToken: null,
              });
            }
          );
          
          // Return the cleanup function for the document listener
          return () => docUnsubscribe();

        } else {
          // No user is signed in
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
        // Error with the auth listener itself
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

    // Return the cleanup function for the auth state listener
    return () => authUnsubscribe();
  }, [auth, firestore]); // Add firestore to dependency array

  return userState;
}
