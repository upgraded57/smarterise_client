/* eslint-disable react-hooks/rules-of-hooks */
import { Link, Navigate, useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchSingleImg } from "@/hooks/hooks";
import { LuCircleUserRound } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/utils/userContext";
import useSocket from "@/hooks/socket";

export default function Picture() {
  const user = useContext(UserContext)?.user;
  // Start Socket Connection
  const socket = useSocket();
  const sessionId = useContext(UserContext)?.sessionId;
  const [pictureViews, setPictureViews] = useState(0);
  const { pictureId } = useParams();
  if (!pictureId) {
    <Navigate to="/" />;
    return;
  }
  const { img, isLoading } = useFetchSingleImg(pictureId);

  // Update image view count
  useEffect(() => {
    if (img) {
      setPictureViews(img.views);
    }

    const data = {
      sessionId,
      userId: user ? user?.id : "",
      pictureId,
      pictureName: img?.name,
    };

    const handlePictureCountUpdate = () => {
      setPictureViews((prev) => prev + 1);
    };
    socket.emit("pictureView", data);
    socket.on("pictureCountUpdate", handlePictureCountUpdate);
    return () => {
      socket.off("pictureCountUpdate", handlePictureCountUpdate);
    };
  }, [pictureId, sessionId, user, socket, img]);

  return isLoading ? (
    <>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Skeleton className="rounded-full w-12 lg:w-20 aspect-square" />
          <div className="space-y-2">
            <Skeleton className="w-[200px] lg:w-[300px] h-6 rounded-lg" />
            <Skeleton className="w-[120px] lg:w-[180px] h-4 rounded-lg" />
          </div>
        </div>
        <Skeleton className="w-[150px] h-10 rounded-lg hidden lg:block" />
      </div>
      <Skeleton className="w-full rounded-2xl h-[600px]" />
    </>
  ) : img ? (
    <>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gray-400 w-12 lg:w-20 aspect-square flex items-center justify-center">
            <LuCircleUserRound className="text-white text-2xl lg:text-4xl" />
          </div>
          <div className="lg:space-y-2">
            <h3 className="text-sm lg:text-lg">{img.author}</h3>
            <p className="text-sm font-light text-gray-400">Author</p>
          </div>
        </div>
        <Link to={img.url} target="_blank">
          <Button className="cursor-pointer">
            <FaArrowRightFromBracket />
            Visit Site
          </Button>
        </Link>
      </div>
      <div className="w-full rounded-2xl h-[600px] overflow-hidden relative">
        <img
          src={img.download_url}
          alt="Image"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="p-4 bg-white rounded-lg flex items-center gap-4">
                  <FaRegEye className="text-primary text-lg" />
                  <p className="text-primary">{pictureViews}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Total Views</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
