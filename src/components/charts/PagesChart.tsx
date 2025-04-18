/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetPagesSummary } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { socket } from "@/hooks/socket";

export default function PagesChart() {
  const { pagesSummary } = useGetPagesSummary();
  const [pageCounts, setPageCounts] = useState<{
    home: number;
    about: number;
    pictures: number;
  }>({
    home: 0,
    about: 0,
    pictures: 0,
  });

  // Update data on first page load
  useEffect(() => {
    if (pagesSummary) {
      setPageCounts({
        home: pagesSummary.home,
        about: pagesSummary.about,
        pictures: pagesSummary.pictures,
      });
    }
  }, [pagesSummary]);

  const chartData = [
    { pages: "home", visitors: pageCounts?.home || 0, fill: "#33BFF8" },
    { pages: "about", visitors: pageCounts?.about || 0, fill: "#049DBE" },
    {
      pages: "product",
      visitors: pageCounts?.pictures || 0,
      fill: "#306DC7",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    home: {
      label: "Homepage",
      color: "#33BFF8",
    },
    about: {
      label: "About page",
      color: "#049DBE",
    },
    product: {
      label: "Picture page",
      color: "#306DC7",
    },
  };

  // Listen for changes
  useEffect(() => {
    const handleCountUpdate = (_: any, type: "home" | "pictures" | "about") => {
      setPageCounts((prev) => {
        switch (type) {
          case "home":
            return { ...prev, home: prev.home + 1 };
          case "about":
            return { ...prev, about: prev.about + 1 };
          case "pictures":
            return { ...prev, pictures: prev.pictures + 1 };
          default:
            return prev;
        }
      });
    };
    socket.on("visitHomepage", (data) => handleCountUpdate(data, "home"));
    socket.on("visitAboutPage", (data) => handleCountUpdate(data, "about"));
    socket.on("visitPicturePage", (data) =>
      handleCountUpdate(data, "pictures")
    );
  }, []);
  return (
    <div className="px-4">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            left: 26,
          }}
        >
          <YAxis
            dataKey="pages"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) =>
              chartConfig[value as keyof typeof chartConfig]?.label
            }
          />
          <XAxis dataKey="visitors" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="visitors" layout="vertical" radius={5} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
