'use client';  // ✅ Next.js에서 클라이언트 컴포넌트로 설정

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, provider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
          router.push(userDoc.data().role === 'influencer' ? '/dashboard/influencer' : '/search');
        } else {
          router.push('/signup');
        }
        setUser(user);
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return unsubscribe;
  }, [router]);

  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      router.push('/signup');
    } else {
      const role = userDoc.data().role;
      setRole(role);
      router.push(role === 'influencer' ? '/profile' : '/search');
    }
  };
  

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
