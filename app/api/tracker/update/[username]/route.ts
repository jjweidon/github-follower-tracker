import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TrackedUser from '@/models/TrackedUser';
import { getFollowers, getFollowing, calculateChanges } from '@/lib/githubService';

// POST: 데이터 업데이트 (스케줄러용)
export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    await dbConnect();

    const trackedUser = await TrackedUser.findOne({ username: username.toLowerCase() });

    if (!trackedUser) {
      return NextResponse.json(
        { error: '추적 중인 사용자가 아닙니다.' },
        { status: 404 }
      );
    }

    // 새로운 팔로워/팔로잉 목록 가져오기
    const newFollowers = await getFollowers(username);
    const newFollowing = await getFollowing(username);

    // 변경 사항 계산
    const followerChanges = calculateChanges(trackedUser.currentFollowers, newFollowers);
    const followingChanges = calculateChanges(trackedUser.currentFollowing, newFollowing);

    const now = new Date();

    // 히스토리에 추가
    trackedUser.history.push({
      date: now,
      followerCount: newFollowers.length,
      followingCount: newFollowing.length,
      followers: newFollowers,
      following: newFollowing,
      followerChanges: followerChanges,
      followingChanges: followingChanges,
    });

    // 현재 상태 업데이트
    trackedUser.currentFollowers = newFollowers;
    trackedUser.currentFollowing = newFollowing;
    trackedUser.lastUpdatedDate = now;

    await trackedUser.save();

    return NextResponse.json({
      message: '업데이트 완료',
      followerChanges,
      followingChanges,
    });
  } catch (error: any) {
    console.error('업데이트 실패:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

