'use client';

import Navbar from '../components/Navbar'; // 네비게이션 추가
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    sns: '',
    bio: '',
    category: '',
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await setDoc(doc(db, 'profiles', user.uid), profile);
    router.push('/dashboard/influencer');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <Navbar /> {/* 네비게이션 추가 */}
      <h1 className="text-xl mb-4">인플루언서 프로필 등록</h1>
      <input name="name" value={profile.name} onChange={handleChange} placeholder="이름" className="p-2 border rounded mb-2" />
      <input name="email" value={profile.email} readOnly className="p-2 border rounded mb-2 bg-gray-200" />
      <input name="sns" value={profile.sns} onChange={handleChange} placeholder="SNS 링크" className="p-2 border rounded mb-2" />
      <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="소개" className="p-2 border rounded mb-2"></textarea>
      <input name="category" value={profile.category} onChange={handleChange} placeholder="카테고리 (예: 뷰티, 게임)" className="p-2 border rounded mb-2" />
      <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">저장 후 대시보드 이동</button>
    </div>
  );
}
