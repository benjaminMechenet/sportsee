import { createContext, useContext } from "react";
import type { UserProfile } from "../services/authService";

type UserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("Context not found");
  return context;
};
