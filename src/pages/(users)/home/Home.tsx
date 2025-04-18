import Picture from "@/components/picture";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchImgs } from "@/hooks/hooks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useContext, useEffect } from "react";
import { UserContext } from "@/utils/userContext";
import { socket } from "@/hooks/socket";

export default function Home() {
  const { imgs, isLoading } = useFetchImgs();
  const user = useContext(UserContext)?.user;
  const sessionId = useContext(UserContext)?.sessionId;
  useEffect(() => {
    socket.emit("visitHomepage", {
      userId: user?.id,
      sessionId,
    });
  }, [sessionId, user]);
  return (
    <>
      {/* Hero */}
      <div className="w-full h-[400px] flex flex-col gap-10 items-center justify-center px-4 mb-10 rounded-2xl overflow-hidden bg-gray-100 bg-[url(https://images.unsplash.com/photo-1543269664-7eef42226a21?q=80&w=1440&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
        <h1 className="text-3xl font-light text-white text-center text-balance">
          Browse The Best Pictures
        </h1>
        <Link to="/about">
          <Button className="cursor-pointer">About App</Button>
        </Link>
      </div>

      {/* Products */}
      <h3 className="text-lg text-gray-600 lg:pt-10">All Pictures</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {isLoading
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
              <Skeleton
                className="w-full min-w-[200px] aspect-square mr-4"
                key={idx}
              />
            ))
          : imgs?.map((img, idx) => <Picture key={idx} img={img} />)}
      </div>
    </>
  );
}
