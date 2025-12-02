'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import type { PurchaseAnalytics } from '@/types/purchase-analytics';

interface PurchaseAnalyticsTableProps {
  data: PurchaseAnalytics[]
}

export default function PurchaseAnalyticsTable({ data }: PurchaseAnalyticsTableProps) {
  const months = Object.keys(data[0]?.monthlyData || {});

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[200px]">Supplier Name</TableHead>
            {months.map((month) => (
              <TableHead key={month} className="min-w-[120px]">
                {month}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.supplierId}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{item.supplierId}</TableCell>
              <TableCell>{item.supplierName}</TableCell>
              {months.map((month) => (
                <TableCell key={month}>{item.monthlyData[month].toFixed(3)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

