'use client';

import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
// import ChartSection from './components/ChartSection'; // 히스토리 기능 비활성화
// import Modal from './components/Modal'; // 히스토리 기능 비활성화
import FollowerList from './components/FollowerList';
import { GithubUser } from '@/types';
import { useUserStore } from '@/store/useUserStore';

interface UserData {
  currentFollowers: GithubUser[];
  currentFollowing: GithubUser[];
}

export default function Home() {
  const { username, setUsername } = useUserStore();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  // const [selectedHistory, setSelectedHistory] = useState<HistoryRecord | null>(null); // 히스토리 기능 비활성화
  // const [isModalOpen, setIsModalOpen] = useState(false); // 히스토리 기능 비활성화

  // 초기 로드시 저장된 username이 있으면 자동으로 검색
  useEffect(() => {
    if (username && !userData) {
      handleSearch(username);
    }
  }, []); // 빈 배열로 마운트시 한 번만 실행

  const handleSearch = async (username: string) => {
    setLoading(true);
    try {
      // GitHub token 설정 (rate limit 증가: 60 -> 5000 requests/hour)
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      const headers: HeadersInit = token 
        ? { 'Authorization': `token ${token}` }
        : {};

      // GitHub API를 직접 호출하여 기본 목록 가져오기
      const [followersRes, followingRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}/followers?per_page=100`, { headers }),
        fetch(`https://api.github.com/users/${username}/following?per_page=100`, { headers })
      ]);

      if (!followersRes.ok || !followingRes.ok) {
        const errorData = await followersRes.json();
        if (errorData.message?.includes('rate limit')) {
          throw new Error('GitHub API 요청 제한에 도달했습니다. 잠시 후 다시 시도해주세요.');
        }
        throw new Error('GitHub 사용자를 찾을 수 없습니다.');
      }

      const followersBasic = await followersRes.json();
      const followingBasic = await followingRes.json();

      // 각 user의 상세 정보 (name 포함)를 가져오기
      const getDetailedUser = async (user: any): Promise<GithubUser> => {
        try {
          const response = await fetch(`https://api.github.com/users/${user.login}`, { headers });
          if (response.ok) {
            const data = await response.json();
            return {
              login: data.login,
              id: data.id,
              avatar_url: data.avatar_url,
              name: data.name,
            };
          }
        } catch (error) {
          console.error(`Failed to fetch user details for ${user.login}:`, error);
        }
        // 실패 시 기본 정보 반환
        return {
          login: user.login,
          id: user.id,
          avatar_url: user.avatar_url,
          name: null,
        };
      };

      // 모든 user의 상세 정보를 병렬로 가져오기
      const [followers, following] = await Promise.all([
        Promise.all(followersBasic.map(getDetailedUser)),
        Promise.all(followingBasic.map(getDetailedUser)),
      ]);

      const userData: UserData = {
        currentFollowers: followers,
        currentFollowing: following,
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
      alert('GitHub 사용자를 찾을 수 없거나 서버와 연결할 수 없습니다.');
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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink bg-clip-text text-transparent">
            Github Follower Tracker
          </h1>
          <div className="inline-block px-4 py-1 rounded-full bg-dark-tertiary/50 border border-accent-cyan/20 backdrop-blur-sm">
            <p className="text-gray-400 text-sm font-mono">
              <span className="text-accent-cyan">$</span> GitHub 계정의 팔로워/팔로잉 정보를 확인합니다
            </p>
          </div>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          loading={loading} 
          initialUsername={username || ''} 
        />

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

