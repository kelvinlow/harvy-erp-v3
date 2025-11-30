'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RefreshCw, MoreVertical } from 'lucide-react';
import PurchaseAnalyticsChart from './purchase-analytics-chart';
import PurchaseAnalyticsTable from './purchase-analytics-table';
import { generateMockData } from '@/data/mock-purchase-analytics';
import type { AnalyticsFilters } from '@/types/purchase-analytics';

export default function PurchaseAnalyticsView() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    supplier: '',
    purchaseInvoice: '',
    value: '',
    dateRange: {
      start: '2024-04-01',
      end: '2025-03-31',
    },
    view: 'monthly',
  });

  const data = generateMockData();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Purchase Analytics</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{/* Add dropdown menu items here */}</DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Select value={filters.supplier} onValueChange={(value) => setFilters({ ...filters, supplier: value })}>
          <option value="">All Suppliers</option>
          {data.map((item) => (
            <option key={item.supplierId} value={item.supplierName}>
              {item.supplierName}
            </option>
          ))}
        </Select>

        <Select
          value={filters.purchaseInvoice}
          onValueChange={(value) => setFilters({ ...filters, purchaseInvoice: value })}
        >
          <option value="">All Invoices</option>
          {/* Add invoice options */}
        </Select>

        <Select value={filters.value} onValueChange={(value) => setFilters({ ...filters, value: value })}>
          <option value="">All Values</option>
          <option value="highest">Highest to Lowest</option>
          <option value="lowest">Lowest to Highest</option>
        </Select>

        <Select
          value={filters.view}
          onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => setFilters({ ...filters, view: value })}
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </div>

      <div className="mb-6">
        <PurchaseAnalyticsChart data={data} />
      </div>

      <div>
        <PurchaseAnalyticsTable data={data} />
      </div>
    </Card>
  );
}

