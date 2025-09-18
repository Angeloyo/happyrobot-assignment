import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CallLogFull } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";

interface RecentCallsTableProps {
  data: CallLogFull[] | null;
  loading: boolean;
}

export function RecentCallsTable({ data, loading }: RecentCallsTableProps) {

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getResultColor = (result?: string) => {
    return result?.toLowerCase() === 'success' ? 'text-green-600 font-semibold' : 'text-foreground';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentCalls = data ? data.slice(0, 10) : [];

  if (recentCalls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No calls found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Calls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="font-semibold text-foreground">Date</TableHead>
                <TableHead className="font-semibold text-foreground">Carrier</TableHead>
                <TableHead className="font-semibold text-foreground">MC #</TableHead>
                <TableHead className="font-semibold text-foreground">Route</TableHead>
                <TableHead className="font-semibold text-foreground">Load Rate</TableHead>
                <TableHead className="font-semibold text-foreground">Final Rate</TableHead>
                <TableHead className="font-semibold text-foreground">Sentiment</TableHead>
                <TableHead className="font-semibold text-foreground">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCalls.map((call) => (
                <TableRow key={call.call_id} className="border-b border-border hover:bg-muted/50">
                  <TableCell className="text-sm">
                    {formatDate(call.created_at)}
                  </TableCell>
                  <TableCell>
                    {call.carrier_name || '-'}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {call.mc_number || '-'}
                  </TableCell>
                  <TableCell>
                    {call.load_details ? (
                      <span className="text-sm">
                        {call.load_details.origin} → {call.load_details.destination}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {call.load_details?.loadboard_rate 
                      ? formatCurrency(call.load_details.loadboard_rate)
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {call.final_rate ? formatCurrency(call.final_rate) : '-'}
                  </TableCell>
                  <TableCell className={getSentimentColor(call.sentiment)}>
                    {call.sentiment || '-'}
                  </TableCell>
                  <TableCell className={getResultColor(call.result)}>
                    {call.result || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}