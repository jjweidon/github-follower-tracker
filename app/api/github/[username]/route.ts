import { NextRequest, NextResponse } from 'next/server';
import { GithubUser } from '@/types';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const USER_FIELDS = `login databaseId avatarUrl name`;

const PROFILE_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      login name avatarUrl bio location websiteUrl company createdAt
      repositories(privacy: PUBLIC) { totalCount }
      followers { totalCount }
      following { totalCount }
    }
  }
`;

const connectionQuery = (field: 'followers' | 'following') => `
  query ($login: String!, $after: String) {
    user(login: $login) {
      ${field}(first: 100, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes { ${USER_FIELDS} }
      }
    }
  }
`;

class GithubApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function graphql(query: string, variables: Record<string, unknown>) {
  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    // 같은 사용자를 반복 조회할 때 rate limit 소모를 줄이기 위해 5분간 캐시
    next: { revalidate: 300 },
  });

  const body = await res.json().catch(() => ({}));

  if (res.status === 403 || res.status === 429 || body.errors?.some((e: any) => e.type === 'RATE_LIMITED')) {
    throw new GithubApiError('GitHub API 요청 제한에 도달했습니다. 잠시 후 다시 시도해주세요.', 429);
  }
  if (res.status === 401) {
    throw new GithubApiError('GitHub 토큰이 유효하지 않습니다.', 500);
  }
  if (body.errors?.some((e: any) => e.type === 'NOT_FOUND')) {
    throw new GithubApiError('GitHub 사용자를 찾을 수 없습니다.', 404);
  }
  if (!res.ok || body.errors) {
    throw new GithubApiError('GitHub API 요청에 실패했습니다.', 502);
  }

  return body.data;
}

async function fetchAll(login: string, field: 'followers' | 'following'): Promise<GithubUser[]> {
  const users: GithubUser[] = [];
  let after: string | null = null;

  do {
    const data = await graphql(connectionQuery(field), { login, after });
    const conn = data.user[field];
    users.push(
      ...conn.nodes.map((n: any) => ({
        login: n.login,
        id: n.databaseId,
        avatar_url: n.avatarUrl,
        name: n.name,
      }))
    );
    after = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
  } while (after);

  return users;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GITHUB_TOKEN 환경 변수가 설정되지 않았습니다.' }, { status: 500 });
  }

  const { username } = params;

  try {
    const { user } = await graphql(PROFILE_QUERY, { login: username });
    if (!user) {
      return NextResponse.json({ error: 'GitHub 사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    const [followers, following] = await Promise.all([
      fetchAll(user.login, 'followers'),
      fetchAll(user.login, 'following'),
    ]);

    return NextResponse.json({
      profile: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatarUrl,
        bio: user.bio,
        public_repos: user.repositories.totalCount,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        location: user.location,
        blog: user.websiteUrl,
        company: user.company,
        created_at: user.createdAt,
      },
      followers,
      following,
    });
  } catch (error) {
    console.error(`GitHub 데이터 가져오기 실패: ${username}`, error);
    const status = error instanceof GithubApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status });
  }
}
