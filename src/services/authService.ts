import { apiGetUserActivity, apiGetUserInfo, apiPostLogin } from "./apiService";
import {
  mockGetUserActivity,
  mockGetUserInfo,
  mockPostLogin,
} from "./mockService";

export type LoginResponse = {
  token: string;
  userId: string;
};

export type UserProfile = {
  goal: number | null;
  profile: {
    firstName: string;
    lastName: string;
    age: number;
    profilePicture: string;
    height: number;
    weight: number;
    createdAt: string;
    gender: string;
  };
  statistics: {
    totalDistance: string;
    totalSessions: number;
    totalDuration: number;
    totalCaloriesBurned: number;
  };
};

export type UserActivity = {
  date: string;
  distance: number;
  duration: number;
  heartRate: {
    min: number;
    max: number;
    average: number;
  };
  caloriesBurned: number;
};

const useMock = import.meta.env.VITE_USE_MOCK === "true";

const services = {
  login: useMock ? mockPostLogin : apiPostLogin,
  getUserInfo: useMock ? mockGetUserInfo : apiGetUserInfo,
  getUserActivity: useMock ? mockGetUserActivity : apiGetUserActivity,
};

export const loginRequest = (
  username: string,
  password: string,
): Promise<LoginResponse> | LoginResponse => {
  return services.login(username, password);
};

export const getUserInfo = (
  token: string,
): Promise<UserProfile> | UserProfile => {
  return services.getUserInfo(token);
};

export const getUserActivity = (
  token: string,
  startWeek: string,
  endWeek: string,
): Promise<UserActivity[]> | UserActivity[] => {
  return services.getUserActivity(token, startWeek, endWeek);
};
