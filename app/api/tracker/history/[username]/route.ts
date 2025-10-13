import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TrackedUser from '@/models/TrackedUser';

// GET: 사용자 히스토리 조회
export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'day';
    const limit = parseInt(searchParams.get('limit') || '30');

    await dbConnect();

    const trackedUser = await TrackedUser.findOne({ username: username.toLowerCase() });

    if (!trackedUser) {
      return NextResponse.json(
        { error: '추적 중인 사용자가 아닙니다.' },
        { status: 404 }
      );
    }

    // period에 따라 히스토리 필터링 (구현 예정)
    const history = trackedUser.history.slice(-limit);

    return NextResponse.json({
      username: trackedUser.username,
      firstTrackedDate: trackedUser.firstTrackedDate,
      lastUpdatedDate: trackedUser.lastUpdatedDate,
      currentFollowers: trackedUser.currentFollowers,
      currentFollowing: trackedUser.currentFollowing,
      history: history,
    });
  } catch (error: any) {
    console.error('히스토리 조회 실패:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

