import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Prop {
  totalUsers: number;
  onlineUsers: number;
}

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

export default function UsersChart({ totalUsers, onlineUsers }: Prop) {
  const chartData = [
    { user: "active", qty: onlineUsers, fill: "#33BFF8" },
    {
      user: "inactive",
      qty: totalUsers - onlineUsers,
      fill: "#ABABAB",
    },
  ];

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
                        {totalUsers}
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
