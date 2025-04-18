import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetAdminSummary } from "@/hooks/hooks";
import { useEffect } from "react";
import { socket } from "@/hooks/socket";

const chartConfig = {
  qty: {
    label: "Users",
  },
  active: {
    label: "Active Users",
    color: "#33BFF8",
  },
  inactive: {
    label: "Inactive Users",
    color: "#ABABAB",
  },
} satisfies ChartConfig;

export default function UsersChart() {
  const { summary, setSummary } = useGetAdminSummary();
  const chartData = [
    { user: "active", qty: summary.onlineUsers, fill: "#33BFF8" },
    {
      user: "inactive",
      qty: summary.totalUsers - summary.onlineUsers,
      fill: "#ABABAB",
    },
  ];

  useEffect(() => {
    const handleActiveUsers = (data: []) => {
      setSummary((prev) => ({
        ...prev,
        onlineUsers: data.length,
      }));
    };
    socket.on("activeUsers", handleActiveUsers);
    return () => {
      socket.off("activeUsers", handleActiveUsers);
    };
  }, [setSummary]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full h-[300px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="qty"
            nameKey="user"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {summary.totalUsers}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Users
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-[#33BFF8]" />
          <p className="text-sm font-light">Active Users</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-[#ABABAB]" />
          <p className="text-sm font-light">Inctive Users</p>
        </div>
      </div>
    </div>
  );
}
