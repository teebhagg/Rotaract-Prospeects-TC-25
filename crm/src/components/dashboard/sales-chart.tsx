import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const attendanceData = [
  { month: "Jan", attendance: 45, target: 50 },
  { month: "Feb", attendance: 52, target: 50 },
  { month: "Mar", attendance: 48, target: 50 },
  { month: "Apr", attendance: 61, target: 55 },
  { month: "May", attendance: 55, target: 55 },
  { month: "Jun", attendance: 67, target: 60 },
  { month: "Jul", attendance: 63, target: 60 },
  { month: "Aug", attendance: 58, target: 60 },
  { month: "Sep", attendance: 72, target: 65 },
  { month: "Oct", attendance: 69, target: 65 },
  { month: "Nov", attendance: 75, target: 70 },
  { month: "Dec", attendance: 78, target: 70 },
];

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "var(--chart-1)",
  },
  target: {
    label: "Target",
    color: "var(--chart-2)",
  },
};

export function SalesChart() {
  const [timeRange, setTimeRange] = useState("12m");

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Meeting Attendance</CardTitle>
          <CardDescription>Monthly attendance vs targets</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m" className="cursor-pointer">
                Last 3 months
              </SelectItem>
              <SelectItem value="6m" className="cursor-pointer">
                Last 6 months
              </SelectItem>
              <SelectItem value="12m" className="cursor-pointer">
                Last 12 months
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="cursor-pointer">
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="px-6 pb-6">
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart
              data={attendanceData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient
                  id="colorAttendance"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-attendance)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-attendance)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-target)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-target)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/30"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value} members`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="target"
                stackId="1"
                stroke="var(--color-target)"
                fill="url(#colorTarget)"
                strokeDasharray="5 5"
                strokeWidth={1}
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stackId="2"
                stroke="var(--color-attendance)"
                fill="url(#colorAttendance)"
                strokeWidth={1}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
