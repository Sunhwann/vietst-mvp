"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, collection, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useRole } from "@/context/RoleContext";

export default function ProfilePage() {
  const { id } = useParams(); // ✅ 인플루언서 ID 가져오기
  const { user, role } = useRole(); // ✅ 로그인한 유저 정보 가져오기
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ Firestore에서 인플루언서 프로필 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "influencers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.log("🔥 프로필을 찾을 수 없음");
        }
      } catch (error) {
        console.error("🔥 프로필 로드 오류:", error);
      }
    };
    fetchProfile();
  }, [id]);

  // ✅ Firestore에서 메시지 실시간 업데이트 (onSnapshot 사용)
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "messages"),
      where("influencerId", "==", id),
      where("userId", "==", user.uid),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(chatMessages);
    });

    return () => unsubscribe();
  }, [id, user]);

  // ✅ 메시지 전송 기능
  const sendMessage = async () => {
    if (!message.trim() || !user) return;
    try {
      await addDoc(collection(db, "messages"), {
        influencerId: id,
        userId: user.uid,
        text: message,
        timestamp: new Date(),
      });
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

      {/* 💬 실시간 채팅 UI */}
      <div className="mt-6 bg-gray-100 p-4 rounded">
        <h3 className="text-xl font-bold mb-2">💬 메시지 기록</h3>
        <div className="h-40 overflow-y-auto border p-2 mb-2">
          {messages.map((msg) => (
            <p key={msg.id} className="p-1 border-b">{msg.text}</p>
          ))}
        </div>

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
