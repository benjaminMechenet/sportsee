import { getUserActivity, type UserActivity } from "./authService";

export type WeekData = {
  name: string;
  dates: { start: string; end: string };
  distance: number;
};

function parseLocalDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();

  const diff = (day + 6) % 7;

  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getWeekBounds(dateInput: Date, weeksBack: number) {
  const date = new Date(dateInput);

  const day = date.getDay();

  const diffToMonday = (day + 6) % 7;
  const mondayThisWeek = new Date(date);
  mondayThisWeek.setDate(date.getDate() - diffToMonday);
  mondayThisWeek.setHours(0, 0, 0, 0);

  const sundayThisWeek = new Date(mondayThisWeek);
  sundayThisWeek.setDate(mondayThisWeek.getDate() + 6);
  sundayThisWeek.setHours(23, 59, 59, 999);

  const mondayWeeksAgo = new Date(mondayThisWeek);
  mondayWeeksAgo.setDate(mondayThisWeek.getDate() - weeksBack * 7);
  mondayWeeksAgo.setHours(0, 0, 0, 0);

  return {
    mondayWeeksAgo,
    sundayThisWeek,
  };
}

export function groupRecentWeek(data: UserActivity[]): WeekData[] {
  const map = new Map<string, WeekData>();

  data.forEach((item) => {
    const date = parseLocalDate(item.date);

    const monday = getMonday(date);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const key = formatDate(monday);

    if (!map.has(key)) {
      map.set(key, {
        name: `${formatDate(monday)} → ${formatDate(sunday)}`,
        dates: {
          start: formatDate(monday),
          end: formatDate(sunday),
        },
        distance: 0,
      });
    }

    map.get(key)!.distance += item.distance;
  });

  const sortedKeys = Array.from(map.keys()).sort();

  const result: WeekData[] = sortedKeys.slice(-4).map((key) => map.get(key)!);

  return result;
}

export function groupByWeek(data: UserActivity[]): WeekData[] {
  const map = new Map<string, WeekData>();

  data.forEach((item) => {
    const date = parseLocalDate(item.date);

    const monday = getMonday(date);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const key = formatDate(monday);

    if (!map.has(key)) {
      map.set(key, {
        name: `${formatDate(monday)} → ${formatDate(sunday)}`,
        dates: {
          start: formatDate(monday),
          end: formatDate(sunday),
        },
        distance: 0,
      });
    }

    map.get(key)!.distance += item.distance;
  });

  const sortedKeys = Array.from(map.keys()).sort();

  if (sortedKeys.length === 0) return [];

  const firstMonday = parseLocalDate(sortedKeys[0]);

  const today = new Date();
  const currentMonday = getMonday(today);

  const lastDataMonday = parseLocalDate(sortedKeys[sortedKeys.length - 1]);

  const lastMonday =
    currentMonday > lastDataMonday ? currentMonday : lastDataMonday;

  const result: WeekData[] = [];

  const current = new Date(firstMonday);

  while (current <= lastMonday) {
    const monday = new Date(current);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const key = formatDate(monday);

    if (map.has(key)) {
      result.push(map.get(key)!);
    } else {
      result.push({
        name: `${formatDate(monday)} → ${formatDate(sunday)}`,
        dates: {
          start: formatDate(monday),
          end: formatDate(sunday),
        },
        distance: 0,
      });
    }

    current.setDate(current.getDate() + 7);
  }

  return result;
}

export const fetchCurrentWeekOffset = async (token: string, offset: number) => {
  const bounds = getWeekBounds(new Date(), offset);

  const startStr = new Intl.DateTimeFormat("fr-CA").format(
    bounds.mondayWeeksAgo,
  );
  const endStr = new Intl.DateTimeFormat("fr-CA").format(bounds.sundayThisWeek);
  const rawActivities = await getUserActivity(token, startStr, endStr);

  const monday = new Date(bounds.mondayWeeksAgo);
  const expectedDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    date.setHours(23, 59, 59, 999);
    const dateStr = date.toISOString().split("T")[0];
    expectedDates.push(dateStr);
  }

  const paddedWeek: UserActivity[] = expectedDates.map((dateStr) => {
    const activity = rawActivities.find((a) => a.date === dateStr);
    if (activity) return activity;
    return {
      date: dateStr,
      distance: 0,
      duration: 0,
      heartRate: { min: 0, max: 0, average: 0 },
      caloriesBurned: 0,
    };
  });

  return paddedWeek;
};

export const fetchCurrentWeek = async (token: string) => {
  return fetchCurrentWeekOffset(token, 0);
};
