/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Link, NavLink, Outlet } from "react-router";
import { FcCdLogo } from "react-icons/fc";
import { IoSpeedometerOutline } from "react-icons/io5";
import { LuGalleryHorizontal, LuUsersRound } from "react-icons/lu";
import AdminProvider from "@/utils/adminContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { socket } from "@/hooks/socket";

export default function DashboardLayout() {
  const links = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <IoSpeedometerOutline />,
    },
    {
      title: "Pictures",
      href: "/admin/pictures",
      icon: <LuGalleryHorizontal />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <LuUsersRound />,
    },
  ];

  useEffect(() => {
    const handleUserOnline = (data: any) => {
      toast.info("User Online", {
        description: data.username
          ? `${data.username} is now online`
          : "An anonymous user is now online",
      });
    };

    const handleNewUserOnline = (data: any) => {
      toast.info("A new user online", {
        description: `A new user ${data.username} registered and is now online`,
      });
    };

    const handleUserOffline = (data: any) => {
      if (data.username) {
        toast.info("User Offline", {
          description: `${data.username} is now offline`,
        });
      }
    };

    const handlePictureCountUpdate = (data: any) => {
      toast.info("A picture was viewed", {
        description: data.username
          ? `${data.username} viewed ${data.pictureName} from ${data.pictureAuthor}`
          : `An anonymous user viewed ${data.pictureName} from ${data.pictureAuthor}`,
      });
    };

    socket.on("userOnline", handleUserOnline);
    socket.on("newUserOnline", handleNewUserOnline);
    socket.on("userOffline", handleUserOffline);
    socket.on("pictureCountUpdate", handlePictureCountUpdate);

    return () => {
      socket.off("userOnline", handleUserOnline);
      socket.off("newUserOnline", handleNewUserOnline);
      socket.off("userOffline", handleUserOffline);
      socket.off("pictureCountUpdate", handlePictureCountUpdate);
    };
  }, []);
  return (
    <AdminProvider>
      <div className="h-screen overflow-y-hidden">
        {/* Nav */}
        <div className="w-full py-4 border-b-[1px] border-b-gray-300">
          <div className="w-full flex justify-between items-center px-4">
            <Link to="/admin">
              <FcCdLogo className="text-5xl" />
            </Link>
            <Link to="/auth/signin">
              <Button className="cursor-pointer" variant="outline">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-start h-full w-full overflow-y-scroll pb-10">
          <div className="min-w-[200px] max-w-[200px] border-r-[1px] border-r-gray-300 h-full sticky top-0">
            {links.map((item, idx) => (
              <NavLink
                to={item.href}
                key={idx}
                className="flex items-center w-full gap-4 p-4 mb-1 hover:bg-gray-100 navlink"
                end
              >
                {item.icon}
                <p className="text-sm">{item.title}</p>
              </NavLink>
            ))}
          </div>
          <div className="w-full min-h-full p-4 mb-10 pb-10 overflow-x-scroll pr-10">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminProvider>
  );
}
