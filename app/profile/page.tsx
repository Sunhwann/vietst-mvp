"use client";

import React, { useEffect, useState } from "react";
import { useRole } from "@/context/RoleContext";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, role, loading } = useRole();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "influencers", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("🔥 프로필 가져오기 오류:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading || loadingProfile) {
    return <p className="text-center mt-10">⏳ 프로필 불러오는 중...</p>;
  }

  if (!profile) {
    return (
      <section className="p-8">
        <p className="text-center">📌 프로필이 없습니다. 먼저 등록해주세요.</p>
        <button 
          className="bg-blue-500 text-white p-2 rounded w-full mt-4" 
          onClick={() => router.push("/register")}
        >
          프로필 등록하기
        </button>
      </section>
    );
  }

  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-4">{profile.name} 프로필</h2>
      <p className="text-lg"><b>SNS:</b> {profile.sns ?? "정보 없음"}</p>
      <p className="text-lg"><b>팔로워:</b> {(profile.followers ?? 0).toLocaleString()}명</p>
      <p className="text-lg"><b>활동 연차:</b> {profile.years_active ?? 0}년</p>
      <p className="text-lg"><b>평균 조회수:</b> {(profile.avg_views ?? 0).toLocaleString()}회</p>
      <p className="text-lg"><b>평균 좋아요:</b> {(profile.avg_likes ?? 0).toLocaleString()}개</p>
      <p className="text-lg"><b>평균 댓글:</b> {(profile.avg_comments ?? 0).toLocaleString()}개</p>
      <p className="text-lg"><b>광고 경험:</b> {profile.sponsored ? "✅ 있음" : "❌ 없음"}</p>
      <p className="text-lg"><b>협업 브랜드:</b> {profile.collab_brands?.join(", ") || "없음"}</p>
      <p className="text-lg"><b>팬층:</b> {profile.audience_age ?? "정보 없음"} / {profile.audience_location ?? "정보 없음"}</p>
      <p className="text-lg"><b>평균 평점:</b> ⭐ {profile.rating ?? "정보 없음"}/5</p>
      <p className="text-lg"><b>공식 인증:</b> {profile.verified ? "✅ 인증됨" : "❌ 인증 안됨"}</p>

      <button 
        className="bg-green-500 text-white p-2 rounded w-full mt-4" 
        onClick={() => router.push("/register")}
      >
        프로필 수정하기
      </button>
    </section>
  );
}
