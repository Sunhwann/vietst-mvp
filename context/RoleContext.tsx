
"use client"; 

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(undefined); // 🔥 초기값 `undefined`
  const [loading, setLoading] = useState(true);

   // ✅ Firestore에서 역할(role) 즉시 가져오기
   const refreshUserRole = async (uid) => {
    if (uid) {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
        } else {
          setRole(null); // 🚀 Firestore에 데이터가 없으면 역할 없음 처리
        }
      } catch (error) {
        console.error("🔥 역할 가져오기 오류:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await refreshUserRole(firebaseUser.uid); // 🔥 로그인 시 역할 즉시 가져오기
      } else {
        setRole(undefined);
      }
      setLoading(false);
    });


    return () => unsubscribe();
  }, []);

  return (
    <RoleContext.Provider value={{ user, role, loading, refreshUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
