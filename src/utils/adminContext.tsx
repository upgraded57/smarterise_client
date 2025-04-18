import { User } from "@/types/types";
import { createContext, ReactNode } from "react";
import { Navigate } from "react-router";

interface Prop {
  user: User | null;
  token: string | null;
}
const AdminContext = createContext<Prop | null>(null);

export default function AdminProvider({ children }: { children: ReactNode }) {
  const token = sessionStorage.getItem("token");
  const userExists = sessionStorage.getItem("user");
  const user = userExists ? (JSON.parse(userExists) as User) : null;

  return (
    <AdminContext.Provider value={{ user, token }}>
      {user && user.type === "admin" ? (
        children
      ) : (
        <Navigate to="/auth/signin" />
      )}
    </AdminContext.Provider>
  );
}
