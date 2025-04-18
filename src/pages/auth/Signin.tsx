import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/hooks";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { persistUser } from "@/utils/persistUser";
import useSocket from "@/hooks/socket";

export default function Signin() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);

  // Start Socket Connection
  const socket = useSocket();

  const { userSignin, isLoading, error, user, adminSignin } = useAuth();
  const handleSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    if (admin) {
      adminSignin(data as { email: string });
    } else {
      userSignin(data as { email: string });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error("Sign in error!", {
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      persistUser(user);
      toast.success("Sign in successful!", {
        description: admin
          ? "Admin sign in successfully"
          : "User sign in successfully",
      });

      // Generate session id for user
      const sessionId = sessionStorage.getItem("sessionId");

      // Send user data to server
      const authUser = {
        email: user ? user.email : "",
        username: user ? user.name : "",
        sessionId: sessionId,
      };

      socket.emit("userSignin", authUser);

      if (admin) {
        navigate("/admin");
        return;
      }

      navigate("/");
    }
  }, [user, navigate, admin, socket]);
  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <Card className="py-10 px-6 gap-2 w-[350px] lg:w-[500px]">
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email to proceed to the app
        </CardDescription>
        <CardContent className="px-0 my-6">
          <form onSubmit={handleSignin}>
            <label htmlFor="email" className="block w-full">
              <p className="text-sm">Email Address</p>
              <Input
                type="email"
                className="w-full"
                id="email"
                name="email"
                disabled={isLoading}
                required
              />
            </label>
            <label
              htmlFor="admin"
              className="flex items-center gap-2 my-4"
              onClick={() => setAdmin((prev) => !prev)}
            >
              <Checkbox id="admin" disabled={isLoading} />
              <p className="text-xs font-light">Login as Admin</p>
            </label>
            <Button className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-2 justify-center mt-10">
            <p className="text-sm">Don't have an account?</p>
            <Link to="/auth/signup" className="text-sm underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
