'use client';

interface ProfileCardProps {
  profile: {
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
  };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const joinDate = new Date(profile.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="mb-8 max-w-4xl mx-auto">
      <div className="relative group">
        {/* 배경 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 via-accent-purple/20 to-pink-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* 카드 본체 */}
        <div className="relative bg-gradient-to-br from-dark-tertiary/90 to-dark-secondary/90 backdrop-blur-xl rounded-3xl border border-accent-cyan/30 group-hover:border-accent-purple/40 transition-all duration-300 overflow-hidden">
          {/* 상단 장식 라인 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan via-accent-purple to-pink-500" />
          
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 왼쪽: 프로필 이미지 영역 */}
              <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
                <div className="relative group/avatar">
                  {/* 아바타 글로우 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-3xl opacity-50 blur-xl group-hover/avatar:blur-2xl transition-all" />
                  
                  {/* 아바타 링 */}
                  <div className="relative p-1 rounded-3xl bg-gradient-to-br from-accent-cyan via-accent-purple to-pink-500">
                    <img
                      src={profile.avatar_url}
                      alt={profile.login}
                      className="relative w-40 h-40 rounded-[1.375rem] border-4 border-dark-primary"
                    />
                  </div>
                  
                  {/* GitHub 배지 */}
                  <a
                    href={`https://github.com/${profile.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute flex items-center gap-2 px-4 py-2 mt-4 rounded-xl bg-dark-primary border border-accent-cyan/40 hover:border-accent-purple/60 transition-all group/link shadow-lg"
                  >
                    <svg className="w-4 h-4 text-accent-cyan group-hover/link:text-accent-purple transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-mono text-white">프로필</span>
                  </a>
                </div>
              </div>

              {/* 오른쪽: 프로필 정보 */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                {/* 이름과 username */}
                <div className="mb-4">
                  {profile.name && (
                    <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                      {profile.name}
                    </h2>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-accent-cyan text-xl font-mono">@{profile.login}</span>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed text-base">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* 통계 카드들 */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="relative group/stat">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/20 to-accent-cyan/10 rounded-xl blur opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                    <div className="relative bg-dark-secondary/60 backdrop-blur-sm border border-accent-cyan/20 rounded-xl p-4 text-center hover:border-accent-cyan/40 transition-all">
                      <div className="text-2xl font-bold text-accent-cyan mb-1">
                        {profile.public_repos.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Repos</div>
                    </div>
                  </div>
                  
                  <div className="relative group/stat">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 to-accent-purple/10 rounded-xl blur opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                    <div className="relative bg-dark-secondary/60 backdrop-blur-sm border border-accent-purple/20 rounded-xl p-4 text-center hover:border-accent-purple/40 transition-all">
                      <div className="text-2xl font-bold text-accent-purple mb-1">
                        {profile.followers.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Followers</div>
                    </div>
                  </div>
                  
                  <div className="relative group/stat">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-pink-500/10 rounded-xl blur opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                    <div className="relative bg-dark-secondary/60 backdrop-blur-sm border border-pink-500/20 rounded-xl p-4 text-center hover:border-pink-500/40 transition-all">
                      <div className="text-2xl font-bold text-pink-400 mb-1">
                        {profile.following.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Following</div>
                    </div>
                  </div>
                </div>

                {/* 추가 정보 태그들 */}
                <div className="flex flex-wrap gap-2">
                  {profile.company && (
                    <div className="group/tag flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-secondary/40 border border-accent-cyan/20 hover:border-accent-cyan/40 transition-all">
                      <svg className="w-4 h-4 text-accent-cyan" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-300">{profile.company}</span>
                    </div>
                  )}
                  
                  {profile.location && (
                    <div className="group/tag flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-secondary/40 border border-accent-purple/20 hover:border-accent-purple/40 transition-all">
                      <svg className="w-4 h-4 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-300">{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.blog && (
                    <a 
                      href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/tag flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-secondary/40 border border-pink-500/20 hover:border-pink-500/40 transition-all"
                    >
                      <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-300 truncate max-w-[150px]">{profile.blog}</span>
                    </a>
                  )}
                  
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-secondary/40 border border-gray-500/20">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-400">{joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

