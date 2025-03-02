"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setUser(auth.currentUser);
    setName(auth.currentUser.displayName || "");
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!role) {
      alert("역할을 선택해주세요!");
      return;
    }

    try {
      setLoading(true);
      const userDocRef = doc(db, "users", user.uid);

      await setDoc(userDocRef, {
        uid: user.uid,
        name,
        email: user.email,
        role,
        createdAt: new Date(),
      });

      alert("✅ 회원가입 완료!");
      router.push(role === "influencer" ? "/register" : "/search");
    } catch (error) {
      console.error("🔥 회원가입 오류:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">회원가입</h2>

      {user ? (
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            className="border p-2 w-full rounded"
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="block text-gray-700 font-medium">역할 선택</label>
          <select
            className="border p-2 w-full rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">역할을 선택하세요</option>
            <option value="user">일반 사용자</option>
            <option value="influencer">인플루언서</option>
          </select>

          <button
            type="submit"
            className={`w-full p-2 rounded text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "가입 중..." : "회원가입 완료"}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-500">회원 정보를 불러오는 중...</p>
      )}
    </section>
  );
}

