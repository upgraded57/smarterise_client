import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFetchSingleImg, useGetPictureViewers } from "@/hooks/hooks";
import { FaRegEye } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { LuCircleUserRound } from "react-icons/lu";
import { Link, useParams } from "react-router";

export default function AdminPicture() {
  const { pictureId } = useParams();

  const { isLoading, img } = useFetchSingleImg(pictureId!);
  const { viewers, isLoading: isLoadingPictureViewers } = useGetPictureViewers(
    pictureId!
  );
  console.log(viewers);

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
                  <p className="text-primary">{img.views}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Total Views</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg">Picture Viewers</h2>
        <div className="flex items-center gap-4 mt-4">
          {isLoadingPictureViewers ? (
            [1, 2, 3].map((_) => (
              <Skeleton
                className="w-[200px] h-10 rounded-full border-[1px] border-gray-200"
                key={_}
              />
            ))
          ) : viewers ? (
            viewers.map((viewer) => (
              <div className="px-4 h-10 rounded-full border-[1px] border-gray-200 flex items-center justify-center bg-gray-100">
                <p className="text-sm font-light">{viewer.name}</p>
              </div>
            ))
          ) : (
            <p className="text-sm">No viewers were found for this picture </p>
          )}
        </div>
        <p className="text-xs font-light text-gray-400 mt-6">
          * Only views of registered users are collected
        </p>
      </div>
    </>
  ) : (
    "Unable to load image"
  );
}
