import mongoose, { Schema, Document } from 'mongoose';

export interface IGithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
}

export interface IFollowerChange {
  added: IGithubUser[];
  removed: IGithubUser[];
}

export interface IFollowingChange {
  added: IGithubUser[];
  removed: IGithubUser[];
}

export interface IHistoryRecord {
  date: Date;
  followerCount: number;
  followingCount: number;
  followers: IGithubUser[];
  following: IGithubUser[];
  followerChanges: IFollowerChange;
  followingChanges: IFollowingChange;
}

export interface ITrackedUser extends Document {
  username: string;
  firstTrackedDate: Date;
  lastUpdatedDate: Date;
  currentFollowers: IGithubUser[];
  currentFollowing: IGithubUser[];
  history: IHistoryRecord[];
}

const GithubUserSchema = new Schema({
  login: { type: String, required: true },
  id: { type: Number, required: true },
  avatar_url: { type: String, required: true },
  name: { type: String, default: null },
});

const FollowerChangeSchema = new Schema({
  added: [GithubUserSchema],
  removed: [GithubUserSchema],
});

const FollowingChangeSchema = new Schema({
  added: [GithubUserSchema],
  removed: [GithubUserSchema],
});

const HistoryRecordSchema = new Schema({
  date: { type: Date, required: true },
  followerCount: { type: Number, required: true },
  followingCount: { type: Number, required: true },
  followers: [GithubUserSchema],
  following: [GithubUserSchema],
  followerChanges: FollowerChangeSchema,
  followingChanges: FollowingChangeSchema,
});

const TrackedUserSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  firstTrackedDate: { type: Date, required: true },
  lastUpdatedDate: { type: Date, required: true },
  currentFollowers: [GithubUserSchema],
  currentFollowing: [GithubUserSchema],
  history: [HistoryRecordSchema],
}, {
  timestamps: true,
});

export default mongoose.models.TrackedUser || mongoose.model<ITrackedUser>('TrackedUser', TrackedUserSchema);

