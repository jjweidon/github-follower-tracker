# GFT (Github Follower Tracker)

GitHub 팔로워/팔로잉 히스토리를 추적하고 시각화하는 웹 서비스입니다.

![GFT Screenshot](docs/gft_wireframe.png)

## 주요 기능

- 📊 **히스토리 추적**: GitHub 사용자의 팔로워/팔로잉 변화를 시간별로 기록
- 📈 **데이터 시각화**: Chart.js를 활용한 인터랙티브 차트
- 🔍 **변경 사항 추적**: 추가/삭제된 팔로워와 팔로잉을 상세히 확인
- ⏰ **자동 업데이트**: GitHub Actions를 통한 매일 자정 자동 데이터 수집
- 📱 **반응형 디자인**: 모바일부터 데스크톱까지 대응

## 기술 스택

### Frontend & Backend
- Next.js 14 (App Router + API Routes)
- TypeScript
- Tailwind CSS
- Chart.js & react-chartjs-2
- MongoDB (Mongoose)
- Axios (GitHub API 클라이언트)

### DevOps
- Vercel (배포)
- GitHub Actions (스케줄러)

## 시작하기

### 사전 요구사항

- Node.js 20 이상
- MongoDB Atlas 계정
- GitHub Personal Access Token

### 설치

1. 저장소 클론

```bash
git clone https://github.com/yourusername/github-follower-tracker.git
cd github-follower-tracker
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력합니다:

```env
# MongoDB Atlas:
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/github-follower-tracker

# GitHub Personal Access Token (선택사항)
GITHUB_TOKEN=<your_github_token>
```

### 개발 모드 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

> ✨ **새로운 구조**: 별도의 백엔드 서버 없이 Next.js API Routes를 사용합니다!

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정
   - `MONGODB_URI`: MongoDB Atlas 연결 문자열
   - `GITHUB_TOKEN`: GitHub Personal Access Token (선택사항)

3. 배포 실행

Next.js API Routes가 자동으로 Vercel Serverless Functions로 배포되므로 별도의 백엔드 서버 배포가 필요하지 않습니다.

### GitHub Actions 설정

GitHub 저장소의 Settings > Secrets에 다음을 추가합니다:

- `MONGODB_URI`: MongoDB 연결 문자열
- `GH_TOKEN`: GitHub Personal Access Token

스케줄러는 매일 자정(KST)에 자동으로 실행됩니다.

## API 엔드포인트

### POST /api/tracker/track
사용자 추적 시작 또는 조회

**요청:**
```json
{
  "username": "github_username"
}
```

**응답:**
```json
{
  "exists": true,
  "user": { ... }
}
```

### GET /api/tracker/history/:username
사용자 히스토리 조회

**쿼리 파라미터:**
- `period`: day | week | month (기본값: day)
- `limit`: 조회할 히스토리 개수 (기본값: 30)

### POST /api/tracker/update/:username
사용자 데이터 업데이트 (스케줄러용)

### GET /api/tracker/users
추적 중인 모든 사용자 목록 조회

## 프로젝트 구조

```
github-follower-tracker/
├── app/                       # Next.js App Router
│   ├── api/                  # API Routes (백엔드)
│   │   └── tracker/         # 추적 API 엔드포인트
│   ├── components/          # React 컴포넌트
│   ├── globals.css          # 글로벌 스타일
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 메인 페이지
├── lib/                      # 유틸리티 라이브러리
│   ├── mongodb.ts           # MongoDB 연결
│   └── githubService.ts     # GitHub API 서비스
├── models/                   # MongoDB 모델
│   └── TrackedUser.ts       # 사용자 추적 모델
├── scripts/                  # 유틸리티 스크립트
├── types/                    # TypeScript 타입 정의
├── .github/workflows/        # GitHub Actions
└── docs/                     # 문서
```

## 라이선스

MIT

## 기여

이슈와 PR은 언제나 환영합니다!

## 문의

프로젝트에 대한 문의사항은 이슈를 통해 남겨주세요.

