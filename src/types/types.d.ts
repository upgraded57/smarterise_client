/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  name: string;
  email: string;
  views: number;
  lastSeen: string;
  type: "user" | "admin";
}

export interface ImgType {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
  views: number;
  name: string;
}

export interface ApiError {
  status: false;
  message: string;
  error: any;
}

export interface OnlineUser {
  email: string;
  sessionId: string;
  signInTime: Date;
  socketId: string;
  username: string;
}

export interface PageView {
  id: string;
  sessionId: string;
  userId: string;
  pictureId: string | null;
  page: string;
  viewTime: Date;
}
