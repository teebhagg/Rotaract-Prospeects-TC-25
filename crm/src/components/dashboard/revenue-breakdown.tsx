import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const membershipData = [
  { category: "active", value: 85, count: 85, fill: "var(--chart-1)" },
  { category: "prospect", value: 25, count: 25, fill: "var(--chart-2)" },
  { category: "inactive", value: 15, count: 15, fill: "var(--chart-3)" },
];

const chartConfig = {
  membership: {
    label: "Membership",
  },
  count: {
    label: "Count",
  },
  active: {
    label: "Active Members",
    color: "var(--chart-1)",
  },
  prospect: {
    label: "Prospects",
    color: "var(--chart-2)",
  },
  inactive: {
    label: "Inactive",
    color: "var(--chart-3)",
  },
};

export function RevenueBreakdown() {
  const id = "membership-breakdown";
  const [activeCategory, setActiveCategory] = React.useState("active");

  const activeIndex = React.useMemo(
    () => membershipData.findIndex((item) => item.category === activeCategory),
    [activeCategory],
  );

  const categories = React.useMemo(
    () => membershipData.map((item) => item.category),
    [],
  );

  return (
    <Card data-chart={id} className="flex flex-col cursor-pointer">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-2">
        <div>
          <CardTitle>Membership Breakdown</CardTitle>
          <CardDescription>Member distribution by status</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger
              className="w-[175px] rounded-lg cursor-pointer"
              aria-label="Select a category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-lg">
              {categories.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig];

                if (!config) {
                  return null;
                }

                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-md [&_span]:flex cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-3 w-3 shrink-0 "
                        style={{
                          backgroundColor: `var(--color-${key})`,
                        }}
                      />
                      {config?.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button variant="outline" className="cursor-pointer">
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="flex justify-center">
            <ChartContainer
              id={id}
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[300px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={membershipData}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                  activeShape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorDataItem) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle">
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold">
                              {membershipData[activeIndex].count}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground">
                              Members
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            {membershipData.map((item, index) => {
              const config =
                chartConfig[item.category as keyof typeof chartConfig];
              const isActive = index === activeIndex;

              return (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                    isActive ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setActiveCategory(item.category)}>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: `var(--color-${item.category})`,
                      }}
                    />
                    <span className="font-medium">{config?.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{item.count}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.value}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
