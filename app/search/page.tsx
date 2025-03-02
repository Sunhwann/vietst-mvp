"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRole } from "@/context/RoleContext";
import HomeButton from "@/components/HomeButton";

export default function SearchPage() {
  const { user, role, loading } = useRole();
  const [name, setName] = useState("");
  const [sns, setSns] = useState("");
  const [influencers, setInfluencers] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleSearch = async () => {
    setLoadingSearch(true);
    try {
      const response = await axios.get("/api/search", {
        params: { name, sns },
      });

      if (response.status === 200) {
        setInfluencers(response.data);
      } else {
        alert("검색 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("🔥 검색 요청 오류:", error);
      alert("서버 연결 오류가 발생했습니다.");
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <section className="p-8">
      <HomeButton />
      <h2 className="text-2xl font-bold mb-4">🔍 인플루언서 검색</h2>

      <div className="bg-white shadow p-4 rounded mb-4">
        <input className="border p-2 m-2 w-full" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 m-2 w-full" placeholder="SNS" value={sns} onChange={(e) => setSns(e.target.value)} />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded w-full">🔎 검색하기</button>
      </div>

      <h3 className="text-xl font-bold mb-2">📌 검색 결과</h3>
      <ul>
        {influencers.map((influencer) => (
          <li key={influencer.id} className="border p-4 mb-2 rounded">
            <h4 className="text-lg font-bold">{influencer.name} {influencer.verified ? "✅" : ""}</h4>
            <p>SNS: {influencer.sns ?? "정보 없음"}</p>
            <p>팔로워 수: {(influencer.followers ?? 0).toLocaleString()}명</p>
            <p>평균 조회수: {(influencer.avg_views ?? 0).toLocaleString()}회</p>
            <p>광고 경험: {influencer.sponsored ? "✅ 있음" : "❌ 없음"}</p>
            <p>협업 브랜드: {influencer.collab_brands?.join(", ") || "없음"}</p>
            <p>평점: ⭐ {influencer.rating ?? "정보 없음"}/5</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
