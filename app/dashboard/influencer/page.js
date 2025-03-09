'use client';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function InfluencerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        console.log('🔥 현재 로그인한 UID:', user.uid);
        
        // 🔥 Firestore에서 데이터 가져오기
        const profileRef = doc(db, 'influencers', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          // ✅ JSON 데이터 변환 후 저장
          const profileData = profileSnap.data();
          profileData.snsLinks = JSON.parse(profileData.snsLinks || '{}');
          setProfile(profileData);
        } else {
          console.error('❌ 프로필 정보를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('❌ 프로필을 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <p>⏳ 로딩 중...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">📢 인플루언서 대시보드</h1>
      {profile ? (
        <div className="mt-4 p-4 border rounded shadow">
          <p><strong>이름:</strong> {profile.name}</p>
          <p><strong>이메일:</strong> {profile.email}</p>
          <p><strong>Instagram:</strong> {profile.snsLinks.instagram || '없음'}</p>
          <p><strong>YouTube:</strong> {profile.snsLinks.youtube || '없음'}</p>
        </div>
      ) : (
        <p>❌ 프로필 정보를 찾을 수 없습니다.</p>
      )}
    </div>
  );
}
