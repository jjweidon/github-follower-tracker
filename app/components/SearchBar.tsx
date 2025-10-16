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
    <div className="mb-12">
      <form onSubmit={handleSubmit} className="flex justify-center items-center gap-4 max-w-3xl mx-auto">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="w-full px-6 py-4 rounded-xl bg-white/95 dark:bg-white/95 backdrop-blur-sm border border-accent-cyan/30 text-gray-900 dark:text-gray-900 text-lg placeholder-gray-500 dark:placeholder-gray-500 focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/20 transition-all font-mono relative z-10"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="relative px-8 py-4 rounded-xl bg-slate-900 dark:bg-black text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-accent-purple/50 group overflow-hidden"
        >
          <span className="relative z-10">{loading ? '조회중...' : '검색'}</span>
        </button>
      </form>
      <p className="text-center text-gray-600 dark:text-gray-500 text-sm mt-4 font-mono">
        <span className="text-accent-cyan/70">{'// '}</span>
        GitHub 사용자명을 입력하여 현재 팔로워/팔로잉 정보를 확인하세요
      </p>
    </div>
  );
}

