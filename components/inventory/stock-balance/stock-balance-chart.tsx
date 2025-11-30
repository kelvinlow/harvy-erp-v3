'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StockBalanceItem } from '@/types/stock-balance';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface StockBalanceChartProps {
  stockData: StockBalanceItem[]
}

export default function StockBalanceChart({ stockData }: StockBalanceChartProps) {
  const [chartType, setChartType] = useState('stockLevels');
  const [groupBy, setGroupBy] = useState('itemGroup');

  // Group data based on selected grouping
  const groupedData = stockData.reduce(
    (acc, item) => {
      const key = item[groupBy as keyof StockBalanceItem] as string;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          totalStock: 0,
          totalValue: 0,
          itemCount: 0,
          lowStockCount: 0,
        };
      }

      acc[key].totalStock += item.currentStock;
      acc[key].totalValue += item.valueInStock;
      acc[key].itemCount += 1;
      if (item.currentStock <= item.reorderLevel) {
        acc[key].lowStockCount += 1;
      }

      return acc;
    },
    {} as Record<string, any>,
  );

  const chartData = Object.values(groupedData);

  // For pie chart - stock status distribution
  const stockStatusData = [
    {
      name: 'Low Stock',
      value: stockData.filter((item) => item.currentStock <= item.reorderLevel).length,
    },
    {
      name: 'Optimal',
      value: stockData.filter((item) => item.currentStock > item.reorderLevel && item.currentStock < item.maxLevel)
        .length,
    },
    {
      name: 'Overstocked',
      value: stockData.filter((item) => item.currentStock >= item.maxLevel).length,
    },
  ];

  const COLORS = ['#ef4444', '#22c55e', '#f59e0b'];

  // Top items by value
  const topItemsByValue = [...stockData]
    .sort((a, b) => b.valueInStock - a.valueInStock)
    .slice(0, 10)
    .map((item) => ({
      name: item.itemName,
      value: item.valueInStock,
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs value={chartType} onValueChange={setChartType} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="stockLevels">Stock Levels</TabsTrigger>
            <TabsTrigger value="stockValue">Stock Value</TabsTrigger>
            <TabsTrigger value="stockStatus">Stock Status</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="itemGroup">Group by Item Group</SelectItem>
            <SelectItem value="location">Group by Location</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TabsContent value="stockLevels" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Stock Levels by {groupBy === 'itemGroup' ? 'Item Group' : 'Location'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalStock" name="Total Stock" fill="#3b82f6" />
                    <Bar dataKey="itemCount" name="Item Count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stockValue" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Stock Value by {groupBy === 'itemGroup' ? 'Item Group' : 'Location'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                    <Legend />
                    <Bar dataKey="totalValue" name="Total Value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stockStatus" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Stock Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stockStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Items']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <Card>
          <CardHeader>
            <CardTitle>Top Items by Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItemsByValue} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                  <Legend />
                  <Bar dataKey="value" name="Stock Value" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

