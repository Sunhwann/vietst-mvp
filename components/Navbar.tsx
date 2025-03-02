"use client";

import React from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/navigation";
import { signOut, deleteUser } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import LogoutButton from "@/components/LogoutButton"; // ✅ 추가


export default function Navbar() {
  const { user, role, loading } = useRole();
  const router = useRouter();

  // ✅ 로그아웃 함수
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("👋 로그아웃 되었습니다.");
      router.push("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("🔥 로그아웃 오류:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // ✅ 회원탈퇴 함수
  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return alert("로그인 후 이용하세요!");

    const confirmDelete = confirm("정말 계정을 삭제하시겠습니까? 😥");
    if (!confirmDelete) return;

    try {
      const user = auth.currentUser;

      // Firestore에서 사용자 데이터 삭제
      await deleteDoc(doc(db, "influencers", user.uid)); // 인플루언서 데이터 삭제
      await deleteDoc(doc(db, "users", user.uid)); // 일반 사용자 데이터 삭제

      // Firebase Authentication에서 계정 삭제
      await deleteUser(user);

      alert("✅ 계정이 삭제되었습니다.");
      router.push("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("🔥 회원탈퇴 오류:", error);
      alert("계정 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* 🔗 홈 버튼 */}
        <Link href="/" className="text-xl font-bold">🏠 Home</Link>

        {/* ⏳ 역할 데이터 로딩 중 */}
        {loading ? (
          <p>⏳ 로딩 중...</p>
        ) : user ? (
          <div className="flex items-center space-x-4">
            {/* ✅ 역할에 따른 버튼 출력 */}
            {role === "influencer" && (
              <>
                <Link href="/profile" className="bg-blue-500 px-3 py-2 rounded">📄 내 프로필</Link>
                <Link href="/register" className="bg-green-500 px-3 py-2 rounded">✏️ 프로필 수정</Link>
              </>
            )}
            {role === "user" && (
              <>
                <Link href="/search" className="bg-yellow-500 px-3 py-2 rounded">🔍 인플루언서 검색</Link>
              </>
            )}

            {/* 🚪 로그아웃 & 🗑️ 회원탈퇴 */}
            <button onClick={handleLogout} className="bg-red-500 px-3 py-2 rounded">🚪 로그아웃</button>
            <button onClick={handleDeleteAccount} className="bg-gray-700 px-3 py-2 rounded">🗑️ 회원탈퇴</button>
          </div>
        ) : (
          <Link href="/login" className="bg-blue-500 px-3 py-2 rounded">🔑 로그인</Link>
        )}
      </div>
    </nav>
  );
}
