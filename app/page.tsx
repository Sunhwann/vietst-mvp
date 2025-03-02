"use client";

import React from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";

export default function HomePage() {
  const { user, role, loading } = useRole();

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">🌟 Vietst 플랫폼</h1>
      <p className="text-lg text-gray-700 mb-4">베트남 인플루언서와 한국 기업을 연결하는 플랫폼</p>

      {loading ? (
        <p className="text-gray-500">⏳ 데이터 불러오는 중...</p>
      ) : !user ? (
        <>
          <p className="mb-4 text-gray-700">서비스를 이용하려면 로그인하세요.</p>
          <Link href="/login" className="bg-blue-500 text-white px-6 py-2 rounded">
            🔑 로그인하기
          </Link>
        </>
      ) : (
        <>
          <p className="mb-4">반갑습니다, <strong>{user.displayName || "사용자"}</strong>님! 🎉</p>
          <p className="mb-4">현재 역할: <strong>{role === "influencer" ? "👑 인플루언서" : "🙋‍♂️ 일반 사용자"}</strong></p>

          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard" className="bg-green-500 text-white px-6 py-2 rounded">📊 대시보드</Link>
            {role === "influencer" ? (
              <Link href="/profile" className="bg-yellow-500 text-white px-6 py-2 rounded">📝 내 프로필 관리</Link>
            ) : (
              <Link href="/search" className="bg-blue-500 text-white px-6 py-2 rounded">🔍 인플루언서 검색</Link>
            )}
          </div>
        </>
      )}
    </section>
  );
}
