"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useRole } from "@/context/RoleContext";
import HomeButton from "@/components/HomeButton"; // ✅ 홈 버튼
import LogoutButton from "@/components/LogoutButton"; // ✅ 로그아웃 버튼

export default function Dashboard() {
  const { user, role } = useRole();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user || role !== "influencer") return;
  
    const q = query(
      collection(db, "messages"),
      where("influencerId", "==", user.uid), // ✅ 인덱스가 필요함!
      orderBy("timestamp", "asc") // ✅ Firestore에서 정렬 시 인덱스 필요
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const receivedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(receivedMessages);
    });
  
    return () => unsubscribe();
  }, [user, role]);

  if (!user) return <p className="text-center mt-10">🔑 로그인 후 이용하세요.</p>;

  return (
    <section className="p-8">
      <HomeButton /> {/* ✅ 홈 버튼 */}
      <LogoutButton /> {/* 🚪 로그아웃 버튼 */}

      <h2 className="text-2xl font-bold mb-4">🎭 대시보드</h2>
      <p className="mb-4">반갑습니다, {user.displayName || "사용자"}님! 👋</p>
      <p className="mb-6">현재 역할: <strong>{role === "influencer" ? "👑 인플루언서" : "🙋‍♂️ 일반 사용자"}</strong></p>

      {/* ✅ 인플루언서 기능 */}
      {role === "influencer" ? (
        <>
          <h3 className="text-xl font-bold mb-2">📌 인플루언서 기능</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/profile" className="block bg-green-500 text-white p-2 rounded">
                📝 내 프로필 수정
              </Link>
            </li>
          </ul>

          {/* 📩 받은 메시지 목록 */}
          <h2 className="text-3xl font-bold mt-6 mb-4">📩 받은 메시지</h2>
          <div className="bg-white shadow p-4 rounded">
            {messages.length === 0 ? (
              <p>📭 받은 메시지가 없습니다.</p>
            ) : (
              <ul>
                {messages.map((msg) => (
                  <li key={msg.id} className="border p-2 mb-2 rounded">
                    <p><b>보낸 유저:</b> {msg.userId}</p>
                    <p><b>내용:</b> {msg.text}</p>
                    <p><b>시간:</b> {new Date(msg.timestamp.toDate()).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        /* ✅ 일반 사용자 기능 */
        <>
          <h3 className="text-xl font-bold mb-2">🔍 사용자 기능</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/search" className="block bg-blue-500 text-white p-2 rounded">
                🔍 인플루언서 검색
              </Link>
            </li>
            <li>
              <Link href="/messages" className="block bg-yellow-500 text-white p-2 rounded">
                📩 보낸 메시지 확인
              </Link>
            </li>
          </ul>
        </>
      )}
    </section>
  );
}
