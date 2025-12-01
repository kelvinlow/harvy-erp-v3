'use client';

import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface PriceHistory {
  date: string;
  documentNo: string;
  supplier: string;
  price: number;
}

interface PriceHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockCode: string;
  description: string;
  priceHistory: PriceHistory[];
}

export function PriceHistoryDialog({
  open,
  onOpenChange,
  stockCode,
  description,
  priceHistory
}: PriceHistoryDialogProps) {
  // Sort price history by date
  const sortedHistory = [...priceHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate statistics
  const currentPrice = sortedHistory[sortedHistory.length - 1]?.price || 0;
  const averagePrice =
    sortedHistory.reduce((acc, curr) => acc + curr.price, 0) /
    sortedHistory.length;
  const priceGoal = averagePrice * 1.1; // Example: Goal is 10% above average

  // Prepare data for chart
  const chartData = sortedHistory.map((item) => ({
    date: format(new Date(item.date), 'MMM dd'),
    price: item.price
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            RM {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Price History - {stockCode}</DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Current Price Display */}
          <div>
            <div className="text-4xl font-bold">
              RM {currentPrice.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Another RM {(priceGoal - currentPrice).toFixed(2)} to Goal
            </div>
          </div>

          {/* Price Trend Chart */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5
                }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `${value}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Price Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold">RM {currentPrice.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Average Price</p>
              <p className="text-2xl font-bold">RM {averagePrice.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Price Goal</p>
              <p className="text-2xl font-bold">RM {priceGoal.toFixed(2)}</p>
            </div>
          </div>

          {/* Price History Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>PO No </TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Price (RM)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {format(new Date(item.date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>{item.documentNo}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell className="text-right">
                      {item.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
