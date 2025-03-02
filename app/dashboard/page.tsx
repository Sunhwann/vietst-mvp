"use client";

import React from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import HomeButton from "@/components/HomeButton"; // ✅ 추가
import LogoutButton from "@/components/LogoutButton"; // ✅ 상대 경로로 변경



export default function Dashboard() {
  const { user, role, loading } = useRole();

  if (loading) {
    return <p className="text-center text-gray-500">⏳ 데이터 불러오는 중...</p>;
  }

  if (!user) {
    return (
      <section className="p-8 text-center">
        <HomeButton /> {/* ✅ 홈 버튼 추가 */}


      <LogoutButton />         {/* 🚪 로그아웃 버튼 */}
        <h2 className="text-2xl font-bold">🚀 대시보드</h2>
        <p>로그인이 필요합니다.</p>
        <Link href="/login" className="bg-blue-500 text-white p-2 rounded">🔑 로그인</Link>
      </section>
    );
  }

  return (
    <section className="p-8">

      <HomeButton /> {/* ✅ 홈 버튼 추가 */}

      <LogoutButton />         {/* 🚪 로그아웃 버튼 */}

      <h2 className="text-2xl font-bold mb-4">🎭 대시보드</h2>

      <p className="mb-4">반갑습니다, {user.displayName || "사용자"}님! 👋</p>

      <p className="mb-6">현재 역할: <strong>{role === "influencer" ? "👑 인플루언서" : "🙋‍♂️ 일반 사용자"}</strong></p>

      {role === "influencer" ? (
        <>
          <h3 className="text-xl font-bold mb-2">📌 인플루언서 기능</h3>
          <ul className="space-y-4">
            <li><Link href="/profile" className="block bg-green-500 text-white p-2 rounded">📝 내 프로필 수정</Link></li>
            <li><Link href="/messages" className="block bg-yellow-500 text-white p-2 rounded">💬 받은 메시지 확인</Link></li>
          </ul>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-2">🔍 사용자 기능</h3>
          <ul className="space-y-4">
            <li><Link href="/search" className="block bg-blue-500 text-white p-2 rounded">🔍 인플루언서 검색</Link></li>
            <li><Link href="/messages" className="block bg-yellow-500 text-white p-2 rounded">📩 보낸 메시지 확인</Link></li>
          </ul>
        </>
      )}
    </section>
  );
}
