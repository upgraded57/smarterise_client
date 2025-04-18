/* eslint-disable react-refresh/only-export-components */
import { User } from "@/types/types";
import { createContext, ReactNode } from "react";

interface Prop {
  user: User | null;
  sessionId: string | null;
}
export const UserContext = createContext<Prop | null>(null);

export default function UserProvider({ children }: { children: ReactNode }) {
  const sessionId = sessionStorage.getItem("sessionId");
  const userExists = sessionStorage.getItem("user");
  const user = userExists ? (JSON.parse(userExists) as User) : null;

  return (
    <UserContext.Provider value={{ user, sessionId }}>
      {children}
    </UserContext.Provider>
  );
}
