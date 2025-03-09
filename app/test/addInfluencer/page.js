'use client';
import { useState } from 'react';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export default function AddInfluencerTest() {
  const { user } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addTestInfluencer = async () => {
    if (!user) {
      setMessage('❌ 로그인 후 다시 시도하세요.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const influencerData = {
        name: user.displayName || '홍길동',
        email: user.email || 'test@example.com',
        profileImage: '',
        bio: '안녕하세요, 인플루언서입니다!',
        specialties: ['패션', '여행'],
        snsLinks: {
          instagram: 'https://instagram.com/example',
          youtube: 'https://youtube.com/example',
        },
        role: 'influencer',
      };

      await setDoc(doc(db, 'influencers', user.uid), influencerData);

      setMessage('✅ 테스트 인플루언서 데이터가 추가되었습니다!');
    } catch (error) {
      console.error('🔥 Firestore 추가 오류:', error);
      setMessage(`❌ 오류 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Firestore 테스트 페이지</h1>
      
      <button
        onClick={addTestInfluencer}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? '추가 중...' : '테스트 데이터 추가'}
      </button>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
