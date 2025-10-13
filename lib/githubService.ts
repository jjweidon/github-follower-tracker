import axios from 'axios';
import { IGithubUser } from '../models/TrackedUser';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubAxios = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: GITHUB_TOKEN ? {
    Authorization: `token ${GITHUB_TOKEN}`,
  } : {},
});

export async function getGithubUser(username: string): Promise<IGithubUser> {
  try {
    const response = await githubAxios.get(`/users/${username}`);
    return {
      login: response.data.login,
      id: response.data.id,
      avatar_url: response.data.avatar_url,
      name: response.data.name,
    };
  } catch (error) {
    console.error(`GitHub 사용자 정보 가져오기 실패: ${username}`, error);
    throw new Error('GitHub 사용자를 찾을 수 없습니다.');
  }
}

export async function getFollowers(username: string): Promise<IGithubUser[]> {
  try {
    const followers: IGithubUser[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await githubAxios.get(`/users/${username}/followers`, {
        params: { per_page: 100, page },
      });

      if (response.data.length === 0) {
        hasMore = false;
      } else {
        const pageFollowers = await Promise.all(
          response.data.map(async (follower: any) => {
            try {
              const userInfo = await getGithubUser(follower.login);
              return userInfo;
            } catch {
              return {
                login: follower.login,
                id: follower.id,
                avatar_url: follower.avatar_url,
                name: null,
              };
            }
          })
        );
        followers.push(...pageFollowers);
        page++;

        if (response.data.length < 100) {
          hasMore = false;
        }
      }
    }

    return followers;
  } catch (error) {
    console.error(`팔로워 목록 가져오기 실패: ${username}`, error);
    throw new Error('팔로워 목록을 가져올 수 없습니다.');
  }
}

export async function getFollowing(username: string): Promise<IGithubUser[]> {
  try {
    const following: IGithubUser[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await githubAxios.get(`/users/${username}/following`, {
        params: { per_page: 100, page },
      });

      if (response.data.length === 0) {
        hasMore = false;
      } else {
        const pageFollowing = await Promise.all(
          response.data.map(async (user: any) => {
            try {
              const userInfo = await getGithubUser(user.login);
              return userInfo;
            } catch {
              return {
                login: user.login,
                id: user.id,
                avatar_url: user.avatar_url,
                name: null,
              };
            }
          })
        );
        following.push(...pageFollowing);
        page++;

        if (response.data.length < 100) {
          hasMore = false;
        }
      }
    }

    return following;
  } catch (error) {
    console.error(`팔로잉 목록 가져오기 실패: ${username}`, error);
    throw new Error('팔로잉 목록을 가져올 수 없습니다.');
  }
}

export function calculateChanges(
  previous: IGithubUser[],
  current: IGithubUser[]
): { added: IGithubUser[]; removed: IGithubUser[] } {
  const previousIds = new Set(previous.map(u => u.id));
  const currentIds = new Set(current.map(u => u.id));

  const added = current.filter(u => !previousIds.has(u.id));
  const removed = previous.filter(u => !currentIds.has(u.id));

  return { added, removed };
}

