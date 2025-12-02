'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { StockBalanceItem } from '@/types/stock-balance';

interface StockBalanceTableProps {
  stockData: StockBalanceItem[];
}

export default function StockBalanceTable({
  stockData
}: StockBalanceTableProps) {
  const [sortField, setSortField] =
    useState<keyof StockBalanceItem>('itemName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof StockBalanceItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...stockData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const getStockStatusBadge = (item: StockBalanceItem) => {
    if (item.currentStock <= item.reorderLevel) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Low Stock
        </Badge>
      );
    } else if (item.currentStock >= item.maxLevel) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Overstocked
        </Badge>
      );
    } else {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Optimal
        </Badge>
      );
    }
  };

  const SortIcon = ({ field }: { field: keyof StockBalanceItem }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[80px]">Item Code</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('itemName')}
                className="flex items-center p-0 font-semibold"
              >
                Item Name
                <SortIcon field="itemName" />
              </Button>
            </TableHead>
            <TableHead>Item Group</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>UOM</TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort('currentStock')}
                className="flex items-center p-0 font-semibold ml-auto"
              >
                Current Stock
                <SortIcon field="currentStock" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort('reorderLevel')}
                className="flex items-center p-0 font-semibold ml-auto"
              >
                Reorder Level
                <SortIcon field="reorderLevel" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort('maxLevel')}
                className="flex items-center p-0 font-semibold ml-auto"
              >
                Max Level
                <SortIcon field="maxLevel" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort('valueInStock')}
                className="flex items-center p-0 font-semibold ml-auto"
              >
                Value
                <SortIcon field="valueInStock" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-8 text-muted-foreground"
              >
                No stock items found
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono">{item.itemCode}</TableCell>
                <TableCell className="font-medium">{item.itemName}</TableCell>
                <TableCell>{item.itemGroup}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.uom}</TableCell>
                <TableCell className="text-right font-medium">
                  {item.currentStock.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {item.reorderLevel.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {item.maxLevel.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  $
                  {item.valueInStock.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </TableCell>
                <TableCell>{getStockStatusBadge(item)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
