'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/'); // 로그아웃 후 메인 페이지로 이동
  };

  return (
    <nav className="w-full bg-gray-100 p-4 flex justify-between items-center shadow-md">
      <button onClick={() => router.push('/')} className="text-blue-500 font-bold">
        🏠 홈으로
      </button>
      {user && (
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          로그아웃
        </button>
      )}
    </nav>
  );
}
