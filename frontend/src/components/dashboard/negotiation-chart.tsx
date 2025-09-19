"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { CallLogFull } from "@/lib/types"

interface NegotiationChartProps {
  data: CallLogFull[] | null;
  loading: boolean;
}

const chartConfig = {
  percentage: {
    label: "Negotiation Rate",
  },
  negotiated: {
    label: "Avg Negotiation",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function NegotiationChart({ data, loading }: NegotiationChartProps) {
  // Calculate average negotiation percentage for successful bookings with both rates
  const successfulBookings = data ? data.filter(log =>
    log.result === "Success" &&
    log.final_rate &&
    log.load_details?.loadboard_rate
  ) : [];

  const negotiationPercentages = successfulBookings.map(log => {
    const finalRate = log.final_rate!;
    const loadboardRate = log.load_details!.loadboard_rate;
    return ((finalRate - loadboardRate) / loadboardRate) * 100;
  });

  const averageNegotiation = negotiationPercentages.length > 0
    ? negotiationPercentages.reduce((sum, pct) => sum + pct, 0) / negotiationPercentages.length
    : 0;

  const displayPercentage = Math.round(averageNegotiation);

  const chartData = [
    { category: "negotiated", percentage: displayPercentage, fill: "var(--chart-3)" },
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Rate Negotiation</CardTitle>
        <CardDescription>Average rate change from initial offer</CardDescription>
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
            <RadialBarChart
              data={chartData}
              endAngle={displayPercentage * 3.6}
              innerRadius={80}
              outerRadius={140}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="percentage" background />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                            className="fill-foreground text-4xl font-bold"
                          >
                            +{displayPercentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Negotiated
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {/* {successfulBookings.length} successful negotiations */}
          Carriers negotiate rates above initial offers
        </div>
      </CardFooter>
    </Card>
  )
}