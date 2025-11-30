'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PurchaseAnalytics } from '@/types/purchase-analytics';

interface PurchaseAnalyticsChartProps {
  data: PurchaseAnalytics[]
}

export default function PurchaseAnalyticsChart({ data }: PurchaseAnalyticsChartProps) {
  // Transform data for the chart
  const chartData = Object.keys(data[0]?.monthlyData || {}).map((month) => ({
    name: month,
    value: data.reduce((sum, supplier) => sum + supplier.monthlyData[month], 0),
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

