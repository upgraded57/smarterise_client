import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUsers } from "@/hooks/hooks";
import { socket } from "@/hooks/socket";
import { OnlineUser } from "@/types/types";
import { Loader2 } from "lucide-react";
import moment from "moment";

import { useEffect, useState } from "react";
import { FaRegDotCircle } from "react-icons/fa";
import { useNavigate } from "react-router";

interface ActiveUser {
  isOnline: boolean | undefined;
  id: string;
  name: string;
  email: string;
  views: number;
  lastSeen: string;
  type: "user" | "admin";
}

export default function Users() {
  const navigate = useNavigate();
  const { isLoading, users, fetchUsers } = useGetUsers();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[] | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[] | undefined>(
    undefined
  );

  useEffect(() => {
    const newActiveUsers = users?.map((user) => {
      const isOnline = onlineUsers?.some(
        (onlineUser) => onlineUser.email === user.email
      );

      return {
        ...user,
        isOnline,
      };
    });

    setActiveUsers(newActiveUsers);

    const handleActiveUsers = (data: []) => {
      setOnlineUsers(data);
    };

    const handleUserOnline = () => {
      // Refetch data
      console.log("Users data will refetch");
      fetchUsers();
    };

    socket.on("activeUsers", handleActiveUsers);
    socket.on("userOnline", handleUserOnline);

    return () => {
      socket.off("activeUsers", handleActiveUsers);
      socket.off("userOnline", handleUserOnline);
    };
  }, [onlineUsers, users, fetchUsers]);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg">All Users</h2>
        <p className="text-sm font-light">
          View a live summary of all users. Click on a user to see their
          activity
        </p>
      </div>

      <div className="flex items-center justify-end gap-10 mb-4">
        <span className="flex items-center gap-2">
          <FaRegDotCircle className="text-green-500" />
          <p className="text-sm">Online Users</p>
        </span>
        <span className="flex items-center gap-2">
          <FaRegDotCircle className="text-red-500" />
          <p className="text-sm">Offline Users</p>
        </span>
      </div>
      <Card className="px-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Pictures Viewed</TableHead>
              <TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <span className="h-[200px] flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={40} />
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              activeUsers?.map((user, idx) => (
                <TableRow
                  key={idx}
                  onClick={() =>
                    navigate(`${user.id}/pageviews`, { state: user })
                  }
                >
                  <TableCell>
                    <span
                      className={
                        user.isOnline ? "text-green-500 pulse" : "text-red-500"
                      }
                    >
                      <FaRegDotCircle />
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.views}</TableCell>
                  <TableCell>
                    {moment(user.lastSeen).format("DD-MM-YYYY, hh:mm a")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      <p className="text-xs font-light text-gray-400 mt-6">
        * Only registered users are viewed
      </p>
    </>
  );
}
