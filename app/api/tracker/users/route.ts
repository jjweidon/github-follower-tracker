import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TrackedUser from '@/models/TrackedUser';

// GET: 모든 추적 중인 사용자 목록
export async function GET() {
  try {
    await dbConnect();

    const users = await TrackedUser.find({}, 'username firstTrackedDate lastUpdatedDate');

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('사용자 목록 조회 실패:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

