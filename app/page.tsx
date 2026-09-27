'use client';

import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
// import ChartSection from './components/ChartSection'; // 히스토리 기능 비활성화
// import Modal from './components/Modal'; // 히스토리 기능 비활성화
import FollowerList from './components/FollowerList';
import ProfileCard from './components/ProfileCard';
import ThemeToggle from './components/ThemeToggle';
import { GithubUser } from '@/types';
import { useUserStore } from '@/store/useUserStore';

interface UserData {
  currentFollowers: GithubUser[];
  currentFollowing: GithubUser[];
}

interface UserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  blog: string | null;
  company: string | null;
  created_at: string;
}

export default function Home() {
  const { username, setUsername } = useUserStore();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  // const [selectedHistory, setSelectedHistory] = useState<HistoryRecord | null>(null); // 히스토리 기능 비활성화
  // const [isModalOpen, setIsModalOpen] = useState(false); // 히스토리 기능 비활성화

  // 초기 로드시 저장된 username이 있으면 자동으로 검색
  useEffect(() => {
    if (username && !userData) {
      handleSearch(username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열로 마운트시 한 번만 실행

  const handleSearch = async (username: string) => {
    setLoading(true);
    try {
      // 서버 API Route에서 GitHub GraphQL로 프로필/팔로워/팔로잉을 한 번에 가져옴
      // (토큰은 서버에만 두고, 사용자별 상세 조회 N+1 요청을 제거해 rate limit 소모를 줄임)
      const response = await fetch(`/api/github/${encodeURIComponent(username)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'GitHub 사용자를 찾을 수 없습니다.');
      }

      setUserProfile(data.profile as UserProfile);

      const userData: UserData = {
        currentFollowers: data.followers as GithubUser[],
        currentFollowing: data.following as GithubUser[],
      };

      setUsername(username); // username을 store에 저장
      setUserData(userData);

      // MongoDB API 호출 비활성화
      // const response = await fetch('/api/tracker/track', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ username }),
      // });

      // const data = await response.json();

      // if (response.ok) {
      //   setUsername(username); // username을 store에 저장
      //   setUserData(data.user); // userData를 store에 저장
      // } else {
      //   alert(data.error || '오류가 발생했습니다.');
      // }
    } catch (error) {
      console.error('검색 실패:', error);
      alert(error instanceof Error ? error.message : 'GitHub 사용자를 찾을 수 없거나 서버와 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // const handleChartClick = (history: HistoryRecord) => { // 히스토리 기능 비활성화
  //   setSelectedHistory(history);
  //   setIsModalOpen(true);
  // };

  const handleUserClick = (username: string) => {
    handleSearch(username);
  };

  return (
    <main className="min-h-screen p-8 relative z-10">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 leading-tight">
              <span className="inline-block">
                <span className="text-7xl font-black text-slate-900 dark:text-white">깃</span>
                <span className="text-3xl text-gray-600 dark:text-gray-500">허브</span>
                <span className="ml-2 text-7xl font-black text-slate-900 dark:text-white">팔</span>
                <span className="text-3xl text-gray-600 dark:text-gray-500">로워</span>
                <span className="ml-2 text-7xl font-black text-slate-900 dark:text-white">추</span>
                <span className="text-3xl text-gray-600 dark:text-gray-500">적기</span>
              </span>
            </h1>
            <div className="inline-block px-4 py-1 rounded-full bg-slate-200/70 dark:bg-dark-tertiary/50 border border-slate-300 dark:border-accent-cyan/20 backdrop-blur-sm">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-mono">
                <span className="text-cyan-600 dark:text-cyan-400">$</span> GitHub 계정의 팔로워/팔로잉 정보를 확인합니다
              </p>
            </div>
          </div>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          loading={loading} 
          initialUsername={username || ''} 
        />

        {/* 프로필 카드 표시 */}
        {userProfile && (
          <ProfileCard profile={userProfile} />
        )}

        {userData && (() => {
          // 나만 상대를 팔로우 (내가 팔로우하지만 상대는 나를 팔로우하지 않음)
          const onlyIFollow = userData.currentFollowing.filter(
            following => !userData.currentFollowers.some(follower => follower.id === following.id)
          );

          // 상대만 나를 팔로우 (상대가 나를 팔로우하지만 나는 상대를 팔로우하지 않음)
          const onlyTheyFollow = userData.currentFollowers.filter(
            follower => !userData.currentFollowing.some(following => following.id === follower.id)
          );

          return (
            <>
              {/* 히스토리 차트 비활성화 */}
              {/* <ChartSection 
                userData={userData} 
                onChartClick={handleChartClick}
              /> */}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <FollowerList 
                  title="팔로워" 
                  count={userData.currentFollowers.length}
                  users={userData.currentFollowers}
                  onUserClick={handleUserClick}
                />
                <FollowerList 
                  title="팔로잉" 
                  count={userData.currentFollowing.length}
                  users={userData.currentFollowing}
                  onUserClick={handleUserClick}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FollowerList 
                  title="상대만 나를 팔로우" 
                  count={onlyTheyFollow.length}
                  users={onlyTheyFollow}
                  onUserClick={handleUserClick}
                />
                <FollowerList 
                  title="나만 상대를 팔로우" 
                  count={onlyIFollow.length}
                  users={onlyIFollow}
                  onUserClick={handleUserClick}
                />
              </div>
            </>
          );
        })()}

        {/* 히스토리 모달 비활성화 */}
        {/* {isModalOpen && selectedHistory && (
          <Modal 
            history={selectedHistory}
            onClose={() => setIsModalOpen(false)}
          />
        )} */}
      </div>
    </main>
  );
}

