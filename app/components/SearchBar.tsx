'use client';

import { useState, FormEvent, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading: boolean;
  initialUsername?: string;
}

export default function SearchBar({ onSearch, loading, initialUsername = '' }: SearchBarProps) {
  const [username, setUsername] = useState(initialUsername);

  // initialUsername이 변경되면 input 값도 업데이트
  useEffect(() => {
    if (initialUsername) {
      setUsername(initialUsername);
    }
  }, [initialUsername]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex justify-center items-center gap-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full max-w-md px-6 py-4 rounded-xl bg-white text-gray-800 text-lg placeholder-gray-400 focus:ring-2 focus:ring-primary transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 rounded-xl bg-primary hover:bg-green-500 text-black font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '조회중...' : '입력'}
        </button>
      </form>
      <p className="text-center text-gray-400 text-sm mt-3">
        GitHub 사용자명을 입력하여 현재 팔로워/팔로잉 정보를 확인하세요.
      </p>
    </div>
  );
}

