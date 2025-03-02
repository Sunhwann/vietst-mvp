"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRole } from "@/context/RoleContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, role, loading } = useRole();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ✅ 로그인 후 역할(role)에 따라 자동 이동 (user가 존재할 때만 실행)
  useEffect(() => {
    if (!loading && user?.uid) {
      const checkRoleAndRedirect = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.role === "influencer") {
              router.push("/profile"); // 인플루언서 → 프로필 관리 페이지
            } else if (userData.role === "user") {
              router.push("/search"); // 일반 사용자 → 인플루언서 검색 페이지
            } else {
              router.push("/register"); // 🚀 신규 사용자 → 회원가입 페이지
            }
          } else {
            router.push("/register"); // 🚀 Firestore에 데이터가 없으면 회원가입 페이지로 이동
          }
        } catch (error) {
          console.error("🔥 Firestore에서 role 확인 중 오류 발생:", error);
        }
      };

      checkRoleAndRedirect();
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      if (!loggedInUser?.uid) {
        throw new Error("Firebase 인증 오류: user.uid가 존재하지 않습니다.");
      }

      // Firestore에서 사용자 정보 확인
      const userRef = doc(db, "users", loggedInUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // 신규 회원이면 Firestore에 추가 후 회원가입 페이지로 이동
        await setDoc(userRef, {
          uid: loggedInUser.uid,
          email: loggedInUser.email,
          role: null, // 🚀 역할 선택 필요
          createdAt: new Date(),
        });
        router.push("/register");
      }
    } catch (error) {
      console.error("🔥 로그인 오류:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">🔑 로그인</h2>
      <button 
        onClick={handleGoogleLogin} 
        className="bg-blue-500 text-white px-6 py-2 rounded flex items-center"
        disabled={isLoggingIn}
      >
        {isLoggingIn ? "⏳ 로그인 중..." : "🔥 Google 로그인"}
      </button>
    </section>
  );
}
