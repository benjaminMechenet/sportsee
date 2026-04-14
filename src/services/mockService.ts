import data from "../data/mock/data.json";
import type { LoginResponse, UserActivity, UserProfile } from "./authService";

type User = {
  id: string;
  username: string;
  password: string;
  goal: number | null | undefined;
  weeklyGoal: number | null | undefined;
  userInfos: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    profilePicture: string;
    height: number;
    weight: number;
    createdAt: string;
  };
  runningData: {
    date: string;
    distance: number;
    duration: number;
    heartRate: {
      min: number;
      max: number;
      average: number;
    };
    caloriesBurned: number;
  }[];
};

export function mockPostLogin(
  username: string,
  password: string,
): LoginResponse {
  const user = (data as User[]).find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    throw new Error("Identifiant ou mot de passe incorrect");
  }

  return {
    token: user.id,
    userId: user.id,
  };
}

export function mockGetUserInfo(token: string): UserProfile {
  const user = (data as User[]).find((u) => u.id === token);

  if (!user) {
    throw new Error("Aucune information trouvée");
  }

  const totalDistance = user.runningData
    .reduce((acc, curr) => acc + curr.distance, 0)
    .toFixed(1);
  const totalSessions = user.runningData.length;
  const totalDuration = user.runningData.reduce(
    (acc, curr) => acc + curr.duration,
    0,
  );

  const totalCaloriesBurned = user.runningData.reduce(
    (acc, curr) => acc + curr.caloriesBurned,
    0,
  );

  const sumGoal = (user.weeklyGoal ?? 0) + (user.goal ?? 0);

  return {
    goal: sumGoal,
    profile: {
      firstName: user.userInfos.firstName,
      lastName: user.userInfos.lastName,
      age: user.userInfos.age,
      profilePicture: user.userInfos.profilePicture,
      height: user.userInfos.height,
      weight: user.userInfos.weight,
      createdAt: user.userInfos.createdAt,
      gender: user.userInfos.gender,
    },
    statistics: {
      totalDistance: totalDistance,
      totalSessions: totalSessions,
      totalDuration: totalDuration,
      totalCaloriesBurned: totalCaloriesBurned,
    },
  };
}

export function mockGetUserActivity(
  token: string,
  startWeek: string,
  endWeek: string,
): UserActivity[] {
  const user = (data as User[]).find((u) => u.id === token);

  if (!user) {
    throw new Error("Aucune information trouvée");
  }

  const startDate = new Date(startWeek);
  const endDate = new Date(endWeek);
  const now = new Date();

  const filteredSessions = user.runningData.filter((session) => {
    const sessionDate = new Date(session.date);
    return (
      sessionDate >= startDate && sessionDate <= endDate && sessionDate <= now
    );
  });

  const sortedSessions = filteredSessions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return sortedSessions;
}
