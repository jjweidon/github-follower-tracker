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
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
      <div className="relative bg-dark-tertiary/60 backdrop-blur-sm border border-accent-cyan/20 rounded-2xl p-6 hover:border-accent-purple/30 transition-all">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-1 w-1 rounded-full bg-accent-cyan animate-pulse" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {title}
          </h3>
          <span className="ml-auto px-3 py-1 rounded-full bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 text-accent-cyan text-sm font-mono font-bold">
            {count}
          </span>
        </div>
        
        <div className="follower-list-scroll space-y-2 max-h-96 overflow-y-auto pr-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="group/item flex items-center gap-3 p-3 bg-dark-secondary/50 backdrop-blur-sm border border-transparent rounded-xl hover:border-accent-cyan/30 hover:bg-dark-secondary/80 transition-all cursor-pointer"
              onClick={() => onUserClick?.(user.login)}
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-dark-primary flex-shrink-0 ring-2 ring-accent-cyan/20 group-hover/item:ring-accent-purple/40 transition-all">
                <Image
                  src={user.avatar_url}
                  alt={user.login}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate font-mono group-hover/item:text-accent-cyan transition-colors">
                  {user.login}
                </p>
                {user.name && (
                  <p className="text-gray-500 text-sm truncate">{user.name}</p>
                )}
              </div>
              <a
                href={`https://github.com/${user.login}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0 p-2 hover:bg-accent-cyan/10 rounded-lg transition-all"
                title="GitHub 프로필 보기"
              >
                <svg 
                  className="w-5 h-5 text-gray-500 hover:text-accent-cyan transition-colors" 
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
    </div>
  );
}

