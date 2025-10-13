'use client';

import Image from 'next/image';
import { GithubUser } from '@/types';

interface FollowerListProps {
  title: string;
  count: number;
  users: GithubUser[];
  onUserClick?: (username: string) => void;
}

export default function FollowerList({ title, count, users, onUserClick }: FollowerListProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">
        {title} {count}
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all cursor-pointer"
            onClick={() => onUserClick?.(user.login)}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
              <Image
                src={user.avatar_url}
                alt={user.login}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{user.login}</p>
              {user.name && (
                <p className="text-gray-400 text-sm truncate">{user.name}</p>
              )}
            </div>
            <a
              href={`https://github.com/${user.login}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 p-2 hover:bg-gray-500 rounded-lg transition-all"
              title="GitHub 프로필 보기"
            >
              <svg 
                className="w-5 h-5 text-gray-300 hover:text-white transition-colors" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

