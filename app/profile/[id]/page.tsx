"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // ✅ URL에서 ID 가져오기
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { id } = useParams(); // ✅ URL에서 인플루언서 ID 가져오기
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Firestore에서 인플루언서 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "influencers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data()); // 모든 데이터 저장
        } else {
          console.log("🔥 프로필을 찾을 수 없음");
        }
      } catch (error) {
        console.error("🔥 프로필 로드 오류:", error);
      }
    };
    fetchProfile();
  }, [id]);

  // ✅ 메시지 전송 기능
  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await addDoc(collection(db, "messages"), {
        influencerId: id,
        text: message,
        timestamp: new Date(),
      });
      alert("✅ 메시지가 전송되었습니다!");
      setMessage(""); // 입력창 초기화
    } catch (error) {
      console.error("🔥 메시지 전송 오류:", error);
    }
  };

  if (!profile) return <p className="text-center mt-10">⏳ 프로필 불러오는 중...</p>;

  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-4">{profile.name} 님의 프로필</h2>
      <table className="w-full border-collapse border border-gray-400">
        <tbody>
          {Object.entries(profile).map(([key, value]) => (
            <tr key={key} className="border">
              <td className="border p-2 font-bold">{key}</td>
              <td className="border p-2">{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 💬 메시지 보내기 기능 */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">💬 메시지 보내기</h3>
        <textarea 
          className="border p-2 w-full" 
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
          onClick={sendMessage} 
          className="bg-blue-500 text-white p-2 rounded w-full mt-2"
        >
          전송하기
        </button>
      </div>
    </section>
  );
}
