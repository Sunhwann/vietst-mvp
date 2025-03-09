import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { auth, db, provider } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteUser, reauthenticateWithPopup } from 'firebase/auth';

export default function DeleteAccount() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // 🔹 1. 사용자 재인증
      const userAuth = auth.currentUser;
      await reauthenticateWithPopup(userAuth, provider);

      // 🔹 2. Firestore에서 사용자 데이터 삭제
      await deleteDoc(doc(db, 'users', user.uid));

      // 🔹 3. Firebase Authentication에서 사용자 삭제
      await deleteUser(userAuth);

      // 🔹 4. 로그아웃 및 메인 페이지 이동
      await logout();
      router.push('/');
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error.message);
      alert(`회원 탈퇴 실패: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold">회원 탈퇴</h2>
      <p className="text-gray-600 mb-4">계정을 삭제하면 복구할 수 없습니다.</p>
      <button onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded">
        회원 탈퇴
      </button>
    </div>
  );
}
