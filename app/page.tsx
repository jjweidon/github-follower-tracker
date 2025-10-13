'use client';

import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ChartSection from './components/ChartSection';
import FollowerList from './components/FollowerList';
import Modal from './components/Modal';
import { TrackedUser, HistoryRecord } from '@/types';

export default function Home() {
  const [userData, setUserData] = useState<TrackedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<HistoryRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (username: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/tracker/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
      } else {
        alert(data.error || '오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('검색 실패:', error);
      alert('서버와 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChartClick = (history: HistoryRecord) => {
    setSelectedHistory(history);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-white">
          Github Follower Tracker
        </h1>
        <p className="text-center text-gray-400 mb-8">
          GitHub 계정의 팔로워/팔로잉 변화를 추적하고 시각화합니다
        </p>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {userData && (
          <>
            <ChartSection 
              userData={userData} 
              onChartClick={handleChartClick}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <FollowerList 
                title="팔로워" 
                count={userData.currentFollowers.length}
                users={userData.currentFollowers} 
              />
              <FollowerList 
                title="팔로잉" 
                count={userData.currentFollowing.length}
                users={userData.currentFollowing} 
              />
            </div>
          </>
        )}

        {isModalOpen && selectedHistory && (
          <Modal 
            history={selectedHistory}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </main>
  );
}

