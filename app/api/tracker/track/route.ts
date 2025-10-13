import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TrackedUser from '@/models/TrackedUser';
import { getFollowers, getFollowing, getGithubUser } from '@/lib/githubService';

// POST: 사용자 추적 시작 또는 조회
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'username이 필요합니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 이미 추적 중인지 확인
    let trackedUser = await TrackedUser.findOne({ username: username.toLowerCase() });

    if (trackedUser) {
      // 이미 존재하면 히스토리 반환
      return NextResponse.json({
        exists: true,
        user: trackedUser,
      });
    }

    // GitHub API로 사용자 확인
    await getGithubUser(username);

    // 새로운 사용자 추적 시작
    const followers = await getFollowers(username);
    const following = await getFollowing(username);

    const now = new Date();

    trackedUser = new TrackedUser({
      username: username.toLowerCase(),
      firstTrackedDate: now,
      lastUpdatedDate: now,
      currentFollowers: followers,
      currentFollowing: following,
      history: [{
        date: now,
        followerCount: followers.length,
        followingCount: following.length,
        followers: followers,
        following: following,
        followerChanges: { added: [], removed: [] },
        followingChanges: { added: [], removed: [] },
      }],
    });

    await trackedUser.save();

    return NextResponse.json({
      exists: false,
      user: trackedUser,
      message: '오늘부터 팔로워 추적을 시작합니다.',
    });
  } catch (error: any) {
    console.error('추적 시작 실패:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

