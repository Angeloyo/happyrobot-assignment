import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CallLogFull } from "@/lib/types";

interface ResultCounts {
  [key: string]: number;
}

interface SuccessRateChartProps {
  data: CallLogFull[] | null;
  loading: boolean;
}

const chartConfig = {
  count: {
    label: "Calls",
  },
} satisfies ChartConfig;

export function SuccessRateChart({ data, loading }: SuccessRateChartProps) {
  
  const resultCounts = data ? data.reduce((acc: ResultCounts, log: CallLogFull) => {
    const result = log.result;
    if (result) {
      acc[result] = (acc[result] || 0) + 1;
    }
    return acc;
  }, {} as ResultCounts) : {};

  const totalCalls = Object.values(resultCounts).reduce((sum, count) => sum + count, 0);
  const successCount = resultCounts['Success'] || 0;
  const successRate = totalCalls > 0 ? Math.round((successCount / totalCalls) * 100) : 0;

  // Define colors for different results
  const getResultColor = (result: string) => {
    switch (result) {
      case 'Success': return 'hsl(142 76% 36%)'; // green
      case 'Failed: Rate too high': return 'hsl(0 84% 60%)'; // bright red
      case 'Failed: Could not find load': return 'hsl(0 70% 50%)'; // medium red
      case 'Failed: MC denied': return 'hsl(0 60% 45%)'; // darker red
      case 'Failed: Cancelled by caller': return 'hsl(0 50% 40%)'; // darkest red
    }
  };

  const chartData = Object.entries(resultCounts).map(([result, count]) => ({
    result,
    count,
    fill: getResultColor(result)
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Success Rate</CardTitle>
        <CardDescription>Call outcome distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="result"
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
                            {successRate}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Success Rate
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {successCount} calls converted to bookings
        </div>
      </CardFooter>
    </Card>
  );
}