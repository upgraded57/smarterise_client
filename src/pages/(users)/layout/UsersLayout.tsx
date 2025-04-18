import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router";
import { FcCdLogo } from "react-icons/fc";
import UserProvider from "@/utils/userContext";
import { toast } from "sonner";
import { useState } from "react";
import { generateSessionId } from "@/utils/functions";
import useSocket from "@/hooks/socket";

export default function UsersLayout() {
  const user = sessionStorage.getItem("user");
  // Start Socket Connection
  const socket = useSocket();
  let sessionId = sessionStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem("sessionId", sessionId);
  }
  const [isSignedIn, setIsSignedIn] = useState(!!user);

  const handleSignOut = () => {
    sessionStorage.clear();
    toast.success("Signout successful", {
      description: "You have been signed out of your account",
    });
    setIsSignedIn((prev) => !prev);

    // Send user session data to server
    socket.emit("userSignout", sessionId);
  };
  return (
    <UserProvider>
      {/* Nav */}
      <div className="w-full py-4 border-b-[1px] border-b-gray-300">
        <div className="w-full max-w-screen-lg mx-auto flex justify-between items-center px-[4vw] lg:px-4">
          <Link to="/">
            <FcCdLogo className="text-5xl" />
          </Link>
          {!isSignedIn ? (
            <Link to="/auth/signin">
              <Button className="cursor-pointer" variant="outline">
                Sign In
              </Button>
            </Link>
          ) : (
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-screen-lg mx-auto px-[4vw] lg:px-4 mt-10">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="w-full py-10 mt-20 border-t-[1px] border-t-gray-300">
        <div className="w-full max-w-screen-lg mx-auto px-[4vw] lg:px-4">
          <p>Footer</p>
        </div>
      </footer>
    </UserProvider>
  );
}
