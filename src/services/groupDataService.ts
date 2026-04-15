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

export function groupDataByWeek(
  startDate: string,
  endDate: string,
  data: UserActivity[],
): WeekData[] {
  const map = new Map<string, WeekData>();

  const start = getMonday(new Date(startDate));
  const end = new Date(endDate);
  const currentMonday = new Date(start);

  while (currentMonday <= end) {
    const monday = new Date(currentMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const key = formatDate(monday);

    map.set(key, {
      name: `${formatDate(monday)} → ${formatDate(sunday)}`,
      dates: {
        start: formatDate(monday),
        end: formatDate(sunday),
      },
      distance: 0,
    });

    currentMonday.setDate(currentMonday.getDate() + 7);
  }

  data.forEach((item) => {
    const date = parseLocalDate(item.date);
    const monday = getMonday(date);
    const key = formatDate(monday);

    if (map.has(key)) {
      map.get(key)!.distance += item.distance;
    }
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
}

export const fetchCurrentWeekOffset = async (token: string, offset: number) => {
  const bounds = getWeeksBounds(offset, 1);

  const startStr = new Intl.DateTimeFormat("fr-CA").format(bounds.start);
  const endStr = new Intl.DateTimeFormat("fr-CA").format(bounds.end);
  const rawActivities = await getUserActivity(token, startStr, endStr);

  const monday = new Date(bounds.start);
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

export function getWeeksBounds(offset: number, weeksNumber: number) {
  const today = new Date();

  const day = today.getDay();
  const diff = (day + 6) % 7;

  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - diff);
  currentMonday.setHours(0, 0, 0, 0);

  const targetMonday = new Date(currentMonday);
  targetMonday.setDate(currentMonday.getDate() - offset * 7);

  const start = new Date(targetMonday);
  start.setDate(targetMonday.getDate() - (weeksNumber - 1) * 7);

  const end = new Date(targetMonday);
  end.setDate(targetMonday.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}
