import { User } from "@/types/types";

export const persistUser = (user: User) => {
  sessionStorage.setItem("user", JSON.stringify(user));
};
