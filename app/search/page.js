'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar'; // 네비게이션 추가
import DeleteAccount from '@/components/DeleteAccount';



export default function Search() {
  const [filter, setFilter] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    setResults([
      { id: 1, name: '홍길동', sns: 'Instagram', followers: 5000, rating: 4.5 },
      { id: 2, name: '김철수', sns: 'YouTube', followers: 10000, rating: 4.8 },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
            <Navbar /> {/* 네비게이션 추가 */}
            <DeleteAccount /> {/* 회원 탈퇴 버튼 추가 */}


      <h1 className="text-xl">인플루언서 검색</h1>
      <input type="text" placeholder="검색 필터 입력" value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded mt-4" />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded mt-4">검색</button>
      <table className="mt-4 border-collapse border border-gray-500">
        <thead>
          <tr>
            <th className="border p-2">이름</th>
            <th className="border p-2">SNS 종류</th>
            <th className="border p-2">팔로워 수</th>
            <th className="border p-2">평점</th>
            <th className="border p-2">액션</th>
          </tr>
        </thead>
        <tbody>
          {results.map((influencer) => (
            <tr key={influencer.id}>
              <td className="border p-2">{influencer.name}</td>
              <td className="border p-2">{influencer.sns}</td>
              <td className="border p-2">{influencer.followers}</td>
              <td className="border p-2">{influencer.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
