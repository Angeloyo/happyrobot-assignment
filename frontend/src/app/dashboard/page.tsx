"use client";

import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";
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

interface SentimentCounts {
  positive: number;
  neutral: number;
  negative: number;
}

const chartConfig = {
  count: {
    label: "Calls",
  },
  positive: {
    label: "Positive",
  },
  neutral: {
    label: "Neutral",
  },
  negative: {
    label: "Negative",
  },
} satisfies ChartConfig;

export default function Dashboard() {
  const [sentimentCounts, setSentimentCounts] = useState<SentimentCounts>({
    positive: 0,
    neutral: 0,
    negative: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const fetchCallLogs = async () => {
    const apiKey = localStorage.getItem("freight_api_key");
    if (!apiKey) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/call-logs", {
        method: "GET",
        headers: {
          "X-API-Key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch call logs");
      }

      const callLogs = await response.json();
      
      const counts = callLogs.reduce((acc: SentimentCounts, log: any) => {
        const sentiment = log.sentiment?.toLowerCase();
        if (sentiment === 'positive') acc.positive++;
        else if (sentiment === 'negative') acc.negative++;
        else acc.neutral++;
        return acc;
      }, { positive: 0, neutral: 0, negative: 0 });
      
      setSentimentCounts(counts);
    } catch (error) {
      console.error('Failed to fetch call logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { sentiment: "positive", count: sentimentCounts.positive, fill: "hsl(142 76% 36%)" },
    { sentiment: "neutral", count: sentimentCounts.neutral, fill: "hsl(240 5% 64%)" },
    { sentiment: "negative", count: sentimentCounts.negative, fill: "hsl(0 84% 60%)" },
  ];

  const totalCalls = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Call Sentiment</CardTitle>
            <CardDescription>Distribution of call sentiments</CardDescription>
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
                  <Pie data={chartData} dataKey="count" nameKey="sentiment" />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Total calls: {totalCalls}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}