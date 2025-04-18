import { socket } from "@/hooks/socket";
import { UserContext } from "@/utils/userContext";
import { useContext, useEffect } from "react";

export default function About() {
  const user = useContext(UserContext)?.user;
  const sessionId = useContext(UserContext)?.sessionId;
  useEffect(() => {
    socket.emit("visitAboutPage", {
      userId: user?.id,
      sessionId,
    });
  }, [sessionId, user]);
  return <div>About Page</div>;
}
