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
import { Load } from "@/lib/types"

interface LoadBookingChartProps {
  data: Load[] | null;
  loading: boolean;
}

const chartConfig = {
  percentage: {
    label: "Booking Rate",
  },
  booked: {
    label: "Booked Loads",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function LoadBookingChart({ data, loading }: LoadBookingChartProps) {
  const totalLoads = data ? data.length : 0;
  const bookedLoads = data ? data.filter(load => load.is_booked).length : 0;
  const bookingPercentage = totalLoads > 0 ? Math.round((bookedLoads / totalLoads) * 100) : 0;

  const chartData = [
    { category: "booked", percentage: bookingPercentage, fill: "var(--chart-2)" },
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Load Booking Rate</CardTitle>
        <CardDescription>Percentage of loads successfully booked</CardDescription>
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
              endAngle={bookingPercentage * 3.6}
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
                            {bookingPercentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Booked
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
          {bookedLoads} of {totalLoads} loads booked
        </div>
      </CardFooter>
    </Card>
  )
}