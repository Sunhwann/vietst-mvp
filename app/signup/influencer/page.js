'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function InfluencerSignup() {
  const { user } = useAuth();
  const router = useRouter();
  const storage = getStorage();

  // 🔥 상태 관리
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [snsLinks, setSnsLinks] = useState({ instagram: '', youtube: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const specialtiesOptions = ['패션', '뷰티', '게임', '여행', '음식', '기타'];

  // 🔥 파일 선택 핸들러
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  // 🔥 체크박스 선택 핸들러
  const handleSpecialtyChange = (specialty) => {
    setSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]
    );
  };

  // 🔥 SNS 링크 입력 핸들러
  const handleSnsChange = (e) => {
    setSnsLinks({ ...snsLinks, [e.target.name]: e.target.value });
  };

  // 🔥 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = profileImageUrl;

      // 🔥 프로필 이미지 업로드
      if (profileImage) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, profileImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      // 🔥 Firestore 문서 존재 여부 확인
      const docRef = doc(db, 'influencers', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // ✅ 기존 데이터 업데이트
        await updateDoc(docRef, {
          profileImage: imageUrl,
          bio,
          specialties,
          snsLinks: JSON.stringify(snsLinks),
        });
      } else {
        // ✅ 새로운 데이터 생성
        await setDoc(docRef, {
          name: user.displayName || '',
          email: user.email || '',
          profileImage: imageUrl,
          bio,
          specialties,
          snsLinks: JSON.stringify(snsLinks),
          role: 'influencer',
        });
      }

      // 🔥 대시보드 페이지로 이동
      router.push('/dashboard/influencer');
    } catch (error) {
      console.error('❌ 프로필 저장 중 오류 발생:', error);
      setError('프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">🎤 인플루언서 프로필 설정</h1>

      {/* 🔥 에러 메시지 */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 🔥 프로필 사진 업로드 */}
      <label className="mb-2">
        <span>📸 프로필 사진 업로드:</span>
        <input type="file" accept="image/*" onChange={handleImageChange} className="ml-2" />
      </label>

      {/* 🔥 자기소개 입력 */}
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="자기소개를 입력하세요"
        className="w-full p-2 border rounded mt-2"
      />

      {/* 🔥 전문 분야 선택 */}
      <div className="mt-4">
        <p>🛠 전문 분야를 선택하세요:</p>
        {specialtiesOptions.map((specialty) => (
          <label key={specialty} className="inline-flex items-center m-2">
            <input
              type="checkbox"
              checked={specialties.includes(specialty)}
              onChange={() => handleSpecialtyChange(specialty)}
            />
            <span className="ml-2">{specialty}</span>
          </label>
        ))}
      </div>

      {/* 🔥 SNS 링크 입력 */}
      <div className="mt-4 w-full">
        <p>🌐 SNS 링크 입력:</p>
        <input
          type="text"
          name="instagram"
          value={snsLinks.instagram}
          onChange={handleSnsChange}
          placeholder="Instagram URL"
          className="w-full p-2 border rounded mt-2"
        />
        <input
          type="text"
          name="youtube"
          value={snsLinks.youtube}
          onChange={handleSnsChange}
          placeholder="YouTube URL"
          className="w-full p-2 border rounded mt-2"
        />
      </div>

      {/* 🔥 저장 버튼 */}
      <button
        onClick={handleSave}
        className={`mt-4 p-2 rounded w-full ${
          loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
        disabled={loading}
      >
        {loading ? '저장 중...' : '✅ 저장 후 대시보드 이동'}
      </button>
    </div>
  );
}
