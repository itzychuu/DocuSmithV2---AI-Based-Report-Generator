import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Check if Firebase auth is properly initialized (not just an empty stub)
const isFirebaseReady = auth && typeof auth.onAuthStateChanged === 'function';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    if (!isFirebaseReady) throw new Error('Firebase is not configured. Please add Firebase credentials to your .env file.');
    const { googleProvider } = await import('../firebase');
    return signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = (email, password) => {
    if (!isFirebaseReady) throw new Error('Firebase is not configured.');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = (email, password) => {
    if (!isFirebaseReady) throw new Error('Firebase is not configured.');
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!isFirebaseReady) return Promise.resolve();
    return signOut(auth);
  };

  useEffect(() => {
    if (!isFirebaseReady) {
      // Firebase not configured — just stop loading so the app renders
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
