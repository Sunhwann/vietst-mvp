'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, role, login, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Vietst</h1>
      <p className="mt-2">베트남 인플루언서와 한국 기업을 연결하는 플랫폼</p>

      {/* 로그인 상태 확인 */}
      {user ? (
        <>
          {role === 'user' && (
            <button
              onClick={() => router.push('/search')}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              인플루언서 검색
            </button>
          )}
          {role === 'influencer' && (
            <button
              onClick={() => router.push('/dashboard/influencer')}
              className="mt-4 bg-green-500 text-white p-2 rounded"
            >
              내 프로필
            </button>
          )}
          <button
            onClick={logout}
            className="mt-4 bg-red-500 text-white p-2 rounded"
          >
            로그아웃
          </button>
        </>
      ) : (
        <button
          onClick={login}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Google 로그인
        </button>
      )}
    </div>
  );
}
