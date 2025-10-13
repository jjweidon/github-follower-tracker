# GFT 설치 및 실행 가이드

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# MongoDB 연결 URI (로컬 또는 MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/github-follower-tracker
# 또는 MongoDB Atlas 사용 시:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/github-follower-tracker

# GitHub Personal Access Token (선택사항 - API rate limit 증가를 위해 권장)
GITHUB_TOKEN=<your_github_token>
```

#### MongoDB Atlas 설정 방법

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 접속
2. 무료 클러스터 생성
3. Database Access에서 사용자 생성
4. Network Access에서 IP 화이트리스트 설정 (개발 시 0.0.0.0/0 허용)
5. Clusters > Connect > Connect your application에서 연결 문자열 복사
6. 연결 문자열의 `<password>`를 실제 비밀번호로 교체

#### GitHub Token 생성 방법

1. GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. "Generate new token" 클릭
3. 권한 선택: `read:user`, `user:follow` (선택사항)
4. 생성된 토큰을 복사하여 `.env` 파일에 추가

### 3. 개발 서버 실행

Next.js 서버 하나만 실행하면 됩니다 (프론트엔드 + API Routes):

```bash
npm run dev
```

### 4. 브라우저에서 확인

[http://localhost:3000](http://localhost:3000)을 열어 확인하세요!

> ✨ **새로운 구조**: 이제 별도의 백엔드 서버 없이 Next.js API Routes를 사용합니다!

---

## 📦 프로덕션 배포

### Vercel 배포

1. **Vercel 프로젝트 생성**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **환경 변수 설정**
   
   Vercel Dashboard > Project Settings > Environment Variables에서 다음을 추가:
   - `MONGODB_URI`: MongoDB Atlas 연결 문자열
   - `GITHUB_TOKEN`: GitHub Personal Access Token (선택사항)

3. **배포**
   ```bash
   vercel --prod
   ```

### API Routes

Next.js API Routes가 자동으로 Vercel Serverless Functions로 배포되므로 별도의 백엔드 서버 배포가 필요하지 않습니다.

---

## ⏰ GitHub Actions 스케줄러 설정

매일 자정에 자동으로 데이터를 수집하려면:

1. **GitHub Secrets 설정**
   
   Repository Settings > Secrets and variables > Actions에서 추가:
   - `MONGODB_URI`: MongoDB 연결 문자열
   - `GH_TOKEN`: GitHub Personal Access Token

2. **워크플로우 확인**
   
   `.github/workflows/update-tracker.yml` 파일이 자동으로 설정되어 있습니다.

3. **수동 실행 테스트**
   
   GitHub Repository > Actions 탭에서 "Update Follower Tracker" 워크플로우를 수동으로 실행하여 테스트할 수 있습니다.

---

## 🧪 테스트

### 사용자 추적 테스트
```bash
curl -X POST http://localhost:3000/api/tracker/track \
  -H "Content-Type: application/json" \
  -d '{"username":"torvalds"}'
```

### 사용자 목록 조회
```bash
curl http://localhost:3000/api/tracker/users
```

### 수동 업데이트 실행
```bash
npm run update-users
```

---

## 🔧 문제 해결

### MongoDB 연결 오류
- `.env` 파일의 `MONGODB_URI`가 올바른지 확인
- MongoDB Atlas의 IP 화이트리스트 확인
- 비밀번호에 특수문자가 있다면 URL 인코딩 필요

### GitHub API Rate Limit
- Personal Access Token을 사용하면 시간당 5,000 요청 가능
- 토큰 없이는 시간당 60 요청으로 제한됨

### 포트 충돌
- 3000번 포트: Next.js (변경: `PORT=3002 npm run dev`)

---

## 📚 추가 기능 개발 아이디어

- [ ] 사용자 인증 및 대시보드
- [ ] 이메일 알림 (팔로워 변경 시)
- [ ] 데이터 내보내기 (CSV, JSON)
- [ ] 여러 계정 동시 추적
- [ ] 팔로워 성장 예측 (ML)
- [ ] 다크/라이트 모드 토글

---

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

## 📄 라이선스

MIT License

