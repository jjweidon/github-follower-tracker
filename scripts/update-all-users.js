const axios = require('axios');
const mongoose = require('mongoose');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

// MongoDB 모델 정의
const GithubUserSchema = new mongoose.Schema({
  login: String,
  id: Number,
  avatar_url: String,
  name: String,
});

const FollowerChangeSchema = new mongoose.Schema({
  added: [GithubUserSchema],
  removed: [GithubUserSchema],
});

const HistoryRecordSchema = new mongoose.Schema({
  date: Date,
  followerCount: Number,
  followingCount: Number,
  followers: [GithubUserSchema],
  following: [GithubUserSchema],
  followerChanges: FollowerChangeSchema,
  followingChanges: FollowerChangeSchema,
});

const TrackedUserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  firstTrackedDate: Date,
  lastUpdatedDate: Date,
  currentFollowers: [GithubUserSchema],
  currentFollowing: [GithubUserSchema],
  history: [HistoryRecordSchema],
});

const TrackedUser = mongoose.model('TrackedUser', TrackedUserSchema);

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1);
  }
}

async function updateUser(username) {
  try {
    console.log(`🔄 ${username} 업데이트 시작...`);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/tracker/update/${username}`,
      {},
      { timeout: 60000 }
    );

    console.log(`✅ ${username} 업데이트 완료`);
    console.log(`  - 팔로워 변경: +${response.data.followerChanges.added.length}, -${response.data.followerChanges.removed.length}`);
    console.log(`  - 팔로잉 변경: +${response.data.followingChanges.added.length}, -${response.data.followingChanges.removed.length}`);
    
    return true;
  } catch (error) {
    console.error(`❌ ${username} 업데이트 실패:`, error.message);
    return false;
  }
}

async function main() {
  try {
    console.log('🚀 추적 사용자 업데이트 스크립트 시작');
    console.log(`📅 실행 시간: ${new Date().toISOString()}`);

    await connectDB();

    // 모든 추적 중인 사용자 가져오기
    const users = await TrackedUser.find({}, 'username');
    console.log(`📊 추적 중인 사용자 수: ${users.length}`);

    if (users.length === 0) {
      console.log('⚠️  추적 중인 사용자가 없습니다.');
      process.exit(0);
    }

    let successCount = 0;
    let failCount = 0;

    // 각 사용자 업데이트 (API rate limit 고려하여 순차 실행)
    for (const user of users) {
      const success = await updateUser(user.username);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // API rate limit 방지를 위해 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n📈 업데이트 완료');
    console.log(`  - 성공: ${successCount}명`);
    console.log(`  - 실패: ${failCount}명`);

    process.exit(failCount > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ 스크립트 실행 오류:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 MongoDB 연결 종료');
  }
}

main();

