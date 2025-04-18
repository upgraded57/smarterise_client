import Picture from "@/components/picture";
import { useGetUserPageViews } from "@/hooks/hooks";
import { socket } from "@/hooks/socket";
import { PageView, User } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router";

export default function PageViews() {
  const [pages, setPages] = useState<{
    home: PageView[];
    about: PageView[];
    pictures: PageView[];
  }>({
    home: [],
    about: [],
    pictures: [],
  });

  const navigate = useNavigate();
  const { userId } = useParams();
  const user = useLocation().state as User;
  useEffect(() => {
    if (!user || !userId || user.id !== userId) {
      navigate(-1);
    }
  }, [user, userId, navigate]);

  const {
    pages: apiViews,
    imgs,
    isLoading,
    fetchUserPageViews,
  } = useGetUserPageViews(userId!);

  useEffect(() => {
    setPages({
      home: apiViews?.filter((view) => view.page.includes("home")) || [],
      about: apiViews?.filter((view) => view.page.includes("about")) || [],
      pictures: apiViews?.filter((view) => view.page.includes("picture")) || [],
    });
  }, [apiViews]);

  useEffect(() => {
    const handleRefetch = () => fetchUserPageViews();
    socket.on("pictureCountUpdate", handleRefetch);

    return () => {
      socket.off("pictureCountUpdate", handleRefetch);
    };
  }, [fetchUserPageViews]);

  return (
    <>
      <h2 className="text-lg">{user.name}'s pages view information</h2>
      <div className="grid grid-cols-3 gap-4 my-4">
        <SummaryCard
          title="Homepage Views"
          count={pages.home.length}
          bgColor="bg-[#4D30F7]"
          isLoading={isLoading}
        />
        <SummaryCard
          title="Picture Views"
          count={pages.pictures.length}
          bgColor="bg-[#306DC7]"
          isLoading={isLoading}
        />
        <SummaryCard
          title="About Page Views"
          count={pages.about.length}
          bgColor="bg-[#049DBE]"
          isLoading={isLoading}
        />
      </div>

      <h2 className="text-lg mt-10 mb-4">Pictures Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {imgs?.map((img, idx) => (
          <Picture
            img={img}
            key={idx}
            viewedOn={
              pages.pictures.find((item) => item.pictureId === img.id)?.viewTime
            }
          />
        ))}
      </div>
    </>
  );
}

const SummaryCard = ({
  title,
  count,
  bgColor,
  isLoading,
}: {
  title: string;
  count: number;
  bgColor: string;
  isLoading: boolean;
}) => {
  return (
    <div
      className={`w-full h-[150px] p-4 ${bgColor} text-white rounded-lg flex items-center relative`}
    >
      <p className="absolute top-4 left-4">{title}</p>
      {isLoading ? (
        <Loader2 className="relative animate-spin top-4" />
      ) : (
        <h1 className="relative top-4 text-3xl font-bold">{count}</h1>
      )}
    </div>
  );
};
