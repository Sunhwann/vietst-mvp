"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRole } from "@/context/RoleContext";

export default function SearchPage() {
  const { user, role, loading } = useRole();
  const [influencers, setInfluencers] = useState([]);
  const [name, setName] = useState("");
  const [sns, setSns] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    if (role !== "user") return; // 일반 사용자만 검색 가능
  }, [role]);

  const handleSearch = async () => {
    setLoadingSearch(true);
    try {
      const response = await axios.get("/api/search", {
        params: { name, sns },
      });
      setInfluencers(response.data);
    } catch (error) {
      console.error("🔥 검색 오류:", error);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const openProfile = (influencerId) => {
    window.open(`/profile/${influencerId}`, "_blank"); // 새 탭에서 프로필 열기
  };

  if (loading) return <p className="text-center mt-10">⏳ 데이터 불러오는 중...</p>;
  if (!user || role !== "user") return <p className="text-center mt-10">🔑 일반 사용자만 검색 가능합니다.</p>;

  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-4">🔍 인플루언서 검색</h2>
      <div className="bg-white shadow p-4 rounded mb-4">
        <input 
          className="border p-2 m-2 w-full" 
          placeholder="이름" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          className="border p-2 m-2 w-full" 
          placeholder="SNS (Instagram, YouTube, TikTok)" 
          value={sns} 
          onChange={(e) => setSns(e.target.value)} 
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          검색하기
        </button>
      </div>

      {loadingSearch ? (
        <p>🔄 검색 중...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">이름</th>
              <th className="border p-2">사용 SNS</th>
              <th className="border p-2">팔로워 수</th>
              <th className="border p-2">평점</th>
              <th className="border p-2">프로필</th>
            </tr>
          </thead>
          <tbody>
            {influencers.map((influencer) => (
              <tr key={influencer.id} className="border">
                <td className="border p-2">{influencer.name}</td>
                <td className="border p-2">{influencer.sns}</td>
                <td className="border p-2">{influencer.followers.toLocaleString()}</td>
                <td className="border p-2">{influencer.rating || "N/A"}</td>
                <td className="border p-2">
                  <button
                    onClick={() => openProfile(influencer.id)}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
