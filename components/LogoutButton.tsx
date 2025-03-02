"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("👋 로그아웃 되었습니다.");
      router.push("/login");
    } catch (error) {
      console.error("🔥 로그아웃 오류:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="bg-red-500 text-white p-2 rounded w-full mt-4"
    >
      🚪 로그아웃
    </button>
  );
}
