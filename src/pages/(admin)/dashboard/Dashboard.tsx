import PagesChart from "@/components/charts/PagesChart";
import PicturesViewsChart from "@/components/charts/PicturesViewsChart";
import UsersChart from "@/components/charts/UsersChart";
import { Card } from "@/components/ui/card";
import { useGetAdminSummary } from "@/hooks/hooks";
import useSocket from "@/hooks/socket";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoading, summary, setSummary } = useGetAdminSummary();
  const socket = useSocket();

  useEffect(() => {
    const handlePictureCountUpdate = () => {
      setSummary((prev) => ({
        ...prev,
        totalPictureViews: prev.totalPictureViews + 1,
      }));
    };

    const handleActiveUsers = (data: []) => {
      setSummary((prev) => ({
        ...prev,
        onlineUsers: data.length,
      }));
    };

    socket.on("pictureCountUpdate", handlePictureCountUpdate);
    socket.on("activeUsers", handleActiveUsers);

    return () => {
      socket.off("pictureCountUpdate", handlePictureCountUpdate);
      socket.off("activeUsers", handleActiveUsers);
    };
  }, [socket, setSummary]);

  const cards = [
    {
      title: "Total Users",
      count: summary.totalUsers,
      bg: "bg-[#4D30F7]",
    },
    {
      title: "Online Users",
      count: summary.onlineUsers,
      bg: "bg-[#306DC7]",
    },
    {
      title: "Total Pictures",
      count: summary.totalPictures,
      bg: "bg-[#049DBE]",
    },
    {
      title: "Total Picture Views",
      count: summary.totalPictureViews,
      bg: "bg-[#33BFF8]",
    },
  ];
  return (
    <>
      <h2 className="text-lg">Overview</h2>
      <div className="grid grid-cols-4 gap-4 my-4 min-w-full">
        {cards.map((item, idx) => (
          <SummaryCard
            key={idx}
            title={item.title}
            count={item.count}
            bgColor={item.bg}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Products Chart */}
      <div className="w-full mt-10">
        <Card className="px-4">
          <p className="text-sm mb-4">Products Views</p>
          <PicturesViewsChart />
        </Card>
      </div>
      <div className="w-full mt-10 flex gap-4">
        <Card className="px-4 flex-2/5">
          <p className="text-sm mb-4">Users</p>
          <UsersChart />
        </Card>
        <Card className="px-4 flex-3/5">
          <p className="text-sm mb-4">Pages Views</p>
          <PagesChart />
        </Card>
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
