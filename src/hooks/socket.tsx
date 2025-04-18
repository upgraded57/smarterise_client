/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:8800", {
  autoConnect: true,
  transports: ["websocket"],
});

export default function useSocket() {
  useEffect(() => {
    const handleConnect = () => console.log("Connection established");
    const handleDisconnect = (data: any) =>
      socket.emit("userDisconnected", data);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return socket;
}
