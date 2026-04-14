import type { LoginResponse, UserActivity, UserProfile } from "./authService";

export async function apiPostLogin(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Identifiant ou mot de passe incorrect");
  }

  return response.json();
}

export async function apiGetUserInfo(token: string): Promise<UserProfile> {
  const response = await fetch("http://localhost:8000/api/user-info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Aucune information trouvée");
  }

  return response.json();
}

export async function apiGetUserActivity(
  token: string,
  startWeek: string,
  endWeek: string,
): Promise<UserActivity[]> {
  const response = await fetch(
    "http://localhost:8000/api/user-activity?startWeek=" +
      startWeek +
      "&endWeek=" +
      endWeek,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Aucune information trouvée pour la période indiquée");
  }

  return response.json();
}
