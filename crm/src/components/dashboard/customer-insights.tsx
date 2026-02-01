import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import {
  ArrowUpIcon,
  MapPin,
  Target,
  TrendingUp,
  UserIcon,
  Users,
} from "lucide-react";

const memberGrowthData = [
  { month: "Jan", new: 12, active: 85, inactive: 8 },
  { month: "Feb", new: 15, active: 92, inactive: 6 },
  { month: "Mar", new: 18, active: 98, inactive: 7 },
  { month: "Apr", new: 22, active: 105, inactive: 9 },
  { month: "May", new: 25, active: 112, inactive: 5 },
  { month: "Jun", new: 28, active: 118, inactive: 4 },
];

const chartConfig = {
  new: {
    label: "New Members",
    color: "var(--chart-1)",
  },
  active: {
    label: "Active",
    color: "var(--chart-2)",
  },
  inactive: {
    label: "Inactive",
    color: "var(--chart-3)",
  },
};

const demographicsData = [
  {
    ageGroup: "18-22",
    members: 45,
    percentage: "36.0%",
    growth: "+15.2%",
    growthColor: "text-green-600",
  },
  {
    ageGroup: "23-27",
    members: 52,
    percentage: "41.6%",
    growth: "+8.7%",
    growthColor: "text-green-600",
  },
  {
    ageGroup: "28-32",
    members: 18,
    percentage: "14.4%",
    growth: "+3.4%",
    growthColor: "text-blue-600",
  },
  {
    ageGroup: "33+",
    members: 10,
    percentage: "8.0%",
    growth: "+1.2%",
    growthColor: "text-orange-600",
  },
];

const chaptersData = [
  {
    chapter: "TC-25 Main",
    members: 85,
    meetings: 12,
    growth: "+12.3%",
    growthColor: "text-green-600",
  },
  {
    chapter: "TC-25 Youth",
    members: 32,
    meetings: 8,
    growth: "+9.7%",
    growthColor: "text-green-600",
  },
  {
    chapter: "TC-25 Alumni",
    members: 8,
    meetings: 2,
    growth: "+18.4%",
    growthColor: "text-blue-600",
  },
];

export function CustomerInsights() {
  const [activeTab, setActiveTab] = useState("growth");

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Member Insights</CardTitle>
        <CardDescription>Growth trends and demographics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg h-12">
            <TabsTrigger
              value="growth"
              className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Growth</span>
            </TabsTrigger>
            <TabsTrigger
              value="demographics"
              className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Demographics</span>
            </TabsTrigger>
            <TabsTrigger
              value="chapters"
              className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Chapters</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="mt-8 space-y-6">
            <div className="grid gap-6">
              {/* Chart and Key Metrics Side by Side */}
              <div className="grid grid-cols-10 gap-6">
                {/* Chart Area - 70% */}
                <div className="col-span-10 xl:col-span-7">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">
                    Member Growth Trends
                  </h3>
                  <ChartContainer
                    config={chartConfig}
                    className="h-[375px] w-full">
                    <BarChart
                      data={memberGrowthData}
                      margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="month"
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "var(--border)" }}
                        axisLine={{ stroke: "var(--border)" }}
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "var(--border)" }}
                        axisLine={{ stroke: "var(--border)" }}
                        domain={[0, "dataMax"]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="new"
                        fill="hsl(var(--chart-1))"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar
                        dataKey="active"
                        fill="hsl(var(--chart-2))"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar
                        dataKey="inactive"
                        fill="hsl(var(--chart-3))"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>

                {/* Key Metrics - 30% */}
                <div className="col-span-10 xl:col-span-3 space-y-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-3 gap-5">
                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          Total Members
                        </span>
                      </div>
                      <div className="text-2xl font-bold">125</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        +12.5% from last month
                      </div>
                    </div>

                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Active Rate</span>
                      </div>
                      <div className="text-2xl font-bold">94.4%</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        +2.1% improvement
                      </div>
                    </div>

                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Avg. Projects
                        </span>
                      </div>
                      <div className="text-2xl font-bold">3.2</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        +8.3% growth
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="mt-8">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="py-5 px-6 font-semibold">
                      Age Group
                    </TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">
                      Members
                    </TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">
                      Percentage
                    </TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">
                      Growth
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demographicsData.map((row, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium py-5 px-6">
                        {row.ageGroup}
                      </TableCell>
                      <TableCell className="text-right py-5 px-6">
                        {row.members}
                      </TableCell>
                      <TableCell className="text-right py-5 px-6">
                        {row.percentage}
                      </TableCell>
                      <TableCell className="text-right py-5 px-6">
                        <span className={`font-medium ${row.growthColor}`}>
                          {row.growth}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="chapters" className="mt-8">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="py-5 px-6 font-semibold">
                      Chapter
                    </TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">
                      Members
                    </TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">
                      Meetings
                    </TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">
                      Growth
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chaptersData.map((row, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium py-5 px-6">
                        {row.chapter}
                      </TableCell>
                      <TableCell className="text-right py-5 px-6">
                        {row.members}
                      </TableCell>
                      <TableCell className="text-right py-5 px-6">
                        {row.meetings}
                      </TableCell>
                      <TableCell className="text-right py-5 px-6">
                        <span className={`font-medium ${row.growthColor}`}>
                          {row.growth}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
