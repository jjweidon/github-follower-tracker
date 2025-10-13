'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { HistoryRecord } from '@/types';
import { format } from 'date-fns';

interface ModalProps {
  history: HistoryRecord;
  onClose: () => void;
}

export default function Modal({ history, onClose }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const addedFollowersCount = history.followerChanges.added.length;
  const removedFollowersCount = history.followerChanges.removed.length;
  const addedFollowingCount = history.followingChanges.added.length;
  const removedFollowingCount = history.followingChanges.removed.length;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {format(new Date(history.date), 'yyyy년 MM월 dd일')}
            </h2>
            <p className="text-gray-400 mt-1">
              팔로워 {history.followerCount}명 · 팔로잉 {history.followingCount}명
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-3xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* 변경 사항 요약 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-2">팔로워 변경</h3>
              <div className="flex gap-4">
                <span className="text-secondary">+{addedFollowersCount}</span>
                <span className="text-gray-400">-{removedFollowersCount}</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-2">팔로잉 변경</h3>
              <div className="flex gap-4">
                <span className="text-tertiary">+{addedFollowingCount}</span>
                <span className="text-gray-400">-{removedFollowingCount}</span>
              </div>
            </div>
          </div>

          {/* 추가된 팔로워 */}
          {addedFollowersCount > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-secondary mb-3">
                추가된 팔로워 ({addedFollowersCount})
              </h3>
              <div className="space-y-2">
                {history.followerChanges.added.map((user) => (
                  <a
                    key={user.id}
                    href={`https://github.com/${user.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                      <Image
                        src={user.avatar_url}
                        alt={user.login}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{user.login}</p>
                      {user.name && (
                        <p className="text-gray-400 text-sm truncate">{user.name}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 삭제된 팔로워 */}
          {removedFollowersCount > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-400 mb-3">
                삭제된 팔로워 ({removedFollowersCount})
              </h3>
              <div className="space-y-2">
                {history.followerChanges.removed.map((user) => (
                  <a
                    key={user.id}
                    href={`https://github.com/${user.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all opacity-60"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                      <Image
                        src={user.avatar_url}
                        alt={user.login}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate line-through">{user.login}</p>
                      {user.name && (
                        <p className="text-gray-400 text-sm truncate">{user.name}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 추가된 팔로잉 */}
          {addedFollowingCount > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-tertiary mb-3">
                추가된 팔로잉 ({addedFollowingCount})
              </h3>
              <div className="space-y-2">
                {history.followingChanges.added.map((user) => (
                  <a
                    key={user.id}
                    href={`https://github.com/${user.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                      <Image
                        src={user.avatar_url}
                        alt={user.login}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{user.login}</p>
                      {user.name && (
                        <p className="text-gray-400 text-sm truncate">{user.name}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 삭제된 팔로잉 */}
          {removedFollowingCount > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-400 mb-3">
                삭제된 팔로잉 ({removedFollowingCount})
              </h3>
              <div className="space-y-2">
                {history.followingChanges.removed.map((user) => (
                  <a
                    key={user.id}
                    href={`https://github.com/${user.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all opacity-60"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                      <Image
                        src={user.avatar_url}
                        alt={user.login}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate line-through">{user.login}</p>
                      {user.name && (
                        <p className="text-gray-400 text-sm truncate">{user.name}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {addedFollowersCount === 0 && removedFollowersCount === 0 && 
           addedFollowingCount === 0 && removedFollowingCount === 0 && (
            <p className="text-center text-gray-400 py-8">
              이 날짜에는 변경 사항이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

