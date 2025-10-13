'use client';

import Image from 'next/image';
import { GithubUser } from '@/types';

interface FollowerListProps {
  title: string;
  count: number;
  users: GithubUser[];
}

export default function FollowerList({ title, count, users }: FollowerListProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">
        {title} {count}
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {users.map((user) => (
          <a
            key={user.id}
            href={`https://github.com/${user.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
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
          </a>
        ))}
      </div>
    </div>
  );
}

