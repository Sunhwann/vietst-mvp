"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseClient";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchMessages();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMessages = async () => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    setMessages(querySnapshot.docs.map((doc) => doc.data()));
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: message,
      sender: user.email,
      timestamp: serverTimestamp()
    });
    setMessage("");
    fetchMessages();
  };

  return (
    <section className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">채팅</h2>
      <div className="border p-4 h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <input
        className="border p-2 w-full rounded"
        placeholder="메시지 입력..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage} className="w-full bg-blue-500 text-white p-2 rounded mt-2">
        전송
      </button>
    </section>
  );
}
