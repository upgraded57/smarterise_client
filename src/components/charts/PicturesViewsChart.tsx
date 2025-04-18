/* eslint-disable @typescript-eslint/no-explicit-any */
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetAdminPicturesSummary } from "@/hooks/hooks";
import { useEffect } from "react";
import useSocket from "@/hooks/socket";

export default function PicturesViewsChart() {
  const socket = useSocket();
  const { pictures, setPictures } = useGetAdminPicturesSummary();

  const chartData = pictures?.map((picture) => ({
    picture: picture.name,
    views: picture.views,
  }));

  const chartConfig = {
    views: {
      label: "Views",
      color: "#2B7FFF",
    },
  };

  useEffect(() => {
    const handlePictureCountUpdate = (data: any) => {
      setPictures((prevPictures) => {
        const viewedPicture = prevPictures?.find(
          (item) => item.id === data.pictureId
        );

        if (viewedPicture) {
          const arrayWithoutViewedPicture =
            prevPictures?.filter((item) => item.id !== viewedPicture.id) || [];

          const updatedViewedPicture = {
            ...viewedPicture,
            views: viewedPicture.views + 1,
          };

          return [...arrayWithoutViewedPicture, updatedViewedPicture];
        }

        // Maintain order of pictures
        return prevPictures;
      });
    };

    socket.on("pictureCountUpdate", handlePictureCountUpdate);
    return () => {
      socket.off("pictureCountUpdate", handlePictureCountUpdate);
    };
  }, [socket]);

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 20,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <YAxis tickLine={false} />
          <XAxis
            dataKey="picture"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) =>
              value?.length < 5 ? value : value.slice(0, 5) + "..."
            }
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />

          <Area
            dataKey="views"
            type="step"
            fill="var(--color-views)"
            fillOpacity={0.4}
            stroke="var(--color-views)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
