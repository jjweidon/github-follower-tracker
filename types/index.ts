export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
}

export interface FollowerChange {
  added: GithubUser[];
  removed: GithubUser[];
}

export interface FollowingChange {
  added: GithubUser[];
  removed: GithubUser[];
}

export interface HistoryRecord {
  date: string;
  followerCount: number;
  followingCount: number;
  followers: GithubUser[];
  following: GithubUser[];
  followerChanges: FollowerChange;
  followingChanges: FollowingChange;
}

export interface TrackedUser {
  username: string;
  firstTrackedDate: string;
  lastUpdatedDate: string;
  currentFollowers: GithubUser[];
  currentFollowing: GithubUser[];
  history: HistoryRecord[];
}

export type PeriodType = 'day' | 'week' | 'month';

export interface ChartData {
  labels: string[];
  followerCounts: number[];
  followingCounts: number[];
  addedFollowers: number[];
  removedFollowers: number[];
  addedFollowing: number[];
  removedFollowing: number[];
}

