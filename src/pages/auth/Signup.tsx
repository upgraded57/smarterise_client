import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/hooks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { persistUser } from "@/utils/persistUser";
import { useEffect } from "react";
import { generateSessionId } from "@/utils/functions";
import useSocket from "@/hooks/socket";

export default function Signup() {
  const navigate = useNavigate();
  const { userSignup, isLoading, error, user } = useAuth();
  // Start Socket Connection
  const socket = useSocket();
  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    userSignup(data as { email: string; name: string });
  };

  useEffect(() => {
    if (error) {
      toast.error("Sign up error!", {
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      persistUser(user);
      toast.success("Sign up successful!", {
        description: "User sign up successfully",
      });

      // Generate session id for user
      let sessionId = sessionStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem("sessionId", sessionId);
      }

      // Send user data to server
      const authUser = {
        email: user ? user.email : "",
        username: user ? user.name : "",
        sessionId: sessionId,
      };

      socket.emit("userSignup", authUser);

      navigate("/");
    }
  }, [user, navigate, socket]);
  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <Card className="py-10 px-6 gap-2 w-[350px] lg:w-[400px]">
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Enter your email to proceed to the app
        </CardDescription>
        <CardContent className="px-0 my-6">
          <form onSubmit={handleSignup}>
            <label htmlFor="name" className="block w-full">
              <p className="text-sm">Full Name</p>
              <Input
                type="name"
                className="w-full"
                id="name"
                name="name"
                disabled={isLoading}
                required
              />
            </label>
            <label htmlFor="email" className="block w-full my-4">
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
            <Button className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              Sign Up
            </Button>
          </form>

          <div className="flex items-center gap-2 justify-center mt-10">
            <p className="text-sm">Already have an account?</p>
            <Link to="/auth/signin" className="text-sm underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
