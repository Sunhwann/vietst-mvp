"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRole } from "@/context/RoleContext";

export default function RegisterPage() {
  const { user, role } = useRole();
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    sns: "",
    followers: "",
    verified: false,
    years_active: "",
    avg_views: "",
    avg_likes: "",
    avg_comments: "",
    sponsored: false,
    collab_brands: "",
    rating: 5,
    audience_age: "",
    audience_location: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return alert("로그인 후 이용하세요!");

    try {
      await setDoc(doc(db, "influencers", user.uid), {
        uid: user.uid,
        ...profile,
        followers: Number(profile.followers),
        years_active: Number(profile.years_active),
        avg_views: Number(profile.avg_views),
        avg_likes: Number(profile.avg_likes),
        avg_comments: Number(profile.avg_comments),
      });

      alert("프로필이 저장되었습니다!");
      router.push("/profile");
    } catch (error) {
      console.error("🔥 프로필 저장 오류:", error);
      alert("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold mb-4">📌 인플루언서 프로필 등록</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded">
        <input className="border p-2 m-2 w-full" name="name" placeholder="이름" onChange={handleChange} />
        <input className="border p-2 m-2 w-full" name="sns" placeholder="SNS" onChange={handleChange} />
        <input className="border p-2 m-2 w-full" name="followers" type="number" placeholder="팔로워 수" onChange={handleChange} />
        <label className="block">
          <input type="checkbox" name="verified" onChange={handleChange} /> ✅ 공식 인증 인플루언서
        </label>
        <input className="border p-2 m-2 w-full" name="years_active" type="number" placeholder="활동 연차" onChange={handleChange} />
        <input className="border p-2 m-2 w-full" name="avg_views" type="number" placeholder="평균 조회수" onChange={handleChange} />
        <input className="border p-2 m-2 w-full" name="avg_likes" type="number" placeholder="평균 좋아요 수" onChange={handleChange} />
        <input className="border p-2 m-2 w-full" name="avg_comments" type="number" placeholder="평균 댓글 수" onChange={handleChange} />
        <label className="block">
          <input type="checkbox" name="sponsored" onChange={handleChange} /> 📢 광고 경험 있음
        </label>
        <input className="border p-2 m-2 w-full" name="collab_brands" placeholder="협업 브랜드 (쉼표로 구분)" onChange={handleChange} />
        <input className="border p-2 m-2 w-full" name="rating" type="number" step="0.1" placeholder="평균 평점 (1~5)" onChange={handleChange} />
        <input className="border p-2 m-2 w-full" name="audience_age" placeholder="팬층 연령대" onChange={handleChange} />
        <input className="border p-2 m-2 w-full" name="audience_location" placeholder="팬층 주요 지역" onChange={handleChange} />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">저장하기</button>
      </form>
    </section>
  );
}
