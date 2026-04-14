import { useEffect, useState, type ReactNode } from "react";
import { UserContext } from "./UserContext";
import { getUserInfo, type UserProfile } from "../services/authService";
import { useAuth } from "./AuthContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      const response = await getUserInfo(token);
      setUser(response);
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
