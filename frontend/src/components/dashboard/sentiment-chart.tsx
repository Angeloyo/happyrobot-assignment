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

interface SentimentChartProps {
  data: any[] | null;
  loading: boolean;
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

export function SentimentChart({ data, loading }: SentimentChartProps) {
  const sentimentCounts = data ? data.reduce((acc: SentimentCounts, log: { sentiment?: string }) => {
    const sentiment = log.sentiment?.toLowerCase();
    if (sentiment === 'positive') acc.positive++;
    else if (sentiment === 'negative') acc.negative++;
    else acc.neutral++;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 }) : { positive: 0, neutral: 0, negative: 0 };

  const chartData = [
    { sentiment: "positive", count: sentimentCounts.positive, fill: "hsl(142 76% 36%)" },
    { sentiment: "neutral", count: sentimentCounts.neutral, fill: "hsl(240 5% 64%)" },
    { sentiment: "negative", count: sentimentCounts.negative, fill: "hsl(0 84% 60%)" },
  ];

  const totalCalls = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;

  return (
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
  );
}