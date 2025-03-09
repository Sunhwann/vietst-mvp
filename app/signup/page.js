'use client';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Signup() {
  const { user, setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    if (!selectedRole) return;

    if (selectedRole === 'influencer') {
      router.push('/signup/influencer'); // 인플루언서 정보 입력 페이지로 이동
    } else {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        role: selectedRole,
      });
      setRole(selectedRole);
      router.push('/search'); // 일반 유저는 검색 페이지로 이동
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl mb-4">회원가입</h1>
      <p>역할을 선택해주세요:</p>
      <button onClick={() => setSelectedRole('user')} className={`p-2 m-2 rounded ${selectedRole === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
        일반 유저
      </button>
      <button onClick={() => setSelectedRole('influencer')} className={`p-2 m-2 rounded ${selectedRole === 'influencer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
        인플루언서
      </button>
      <button onClick={handleSignup} className="bg-green-500 text-white p-2 rounded mt-4">
        계속하기
      </button>
    </div>
  );
}
