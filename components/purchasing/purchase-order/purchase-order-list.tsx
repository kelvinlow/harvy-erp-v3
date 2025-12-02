'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Download, Printer, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { PurchaseOrder } from '@/types';

// Mock data
const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO001',
    poNumber: 'PO-2024-001',
    date: '2024-01-15',
    prNumber: 'PR-2024-001',
    supplierName: 'ABC Hardware Supplies',
    status: 'Pending',
    items: [
      {
        id: '1',
        stockCode: 'HW001',
        description: 'Power Tools Set',
        quantity: 2,
        uom: 'SET',
        unitPrice: 1500,
        amount: 3000
      }
    ],
    total: 3000
  },
  {
    id: 'PO003',
    poNumber: 'PO-2024-003',
    date: '2024-01-17',
    prNumber: 'PR-2024-003',
    supplierName: 'Global Parts Inc',
    status: 'Delivered',
    items: [
      {
        id: '1',
        stockCode: 'SP001',
        description: 'Spare Parts Kit',
        quantity: 5,
        uom: 'KIT',
        unitPrice: 800,
        amount: 4000
      }
    ],
    total: 4000
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    date: '2024-01-16',
    prNumber: 'PR-2024-002',
    supplierName: 'XYZ Industrial Solutions',
    status: 'Approved',
    items: [
      {
        id: '1',
        stockCode: 'MT001',
        description: 'Industrial Motor',
        quantity: 1,
        uom: 'UNIT',
        unitPrice: 5000,
        amount: 5000
      }
    ],
    total: 5000
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    date: '2024-01-16',
    prNumber: 'PR-2024-002',
    supplierName: 'XYZ Industrial Solutions',
    status: 'Approved',
    items: [
      {
        id: '1',
        stockCode: 'MT001',
        description: 'Industrial Motor',
        quantity: 1,
        uom: 'UNIT',
        unitPrice: 5000,
        amount: 5000
      }
    ],
    total: 5000
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    date: '2024-01-16',
    prNumber: 'PR-2024-002',
    supplierName: 'XYZ Industrial Solutions',
    status: 'Approved',
    items: [
      {
        id: '1',
        stockCode: 'MT001',
        description: 'Industrial Motor',
        quantity: 1,
        uom: 'UNIT',
        unitPrice: 5000,
        amount: 5000
      }
    ],
    total: 5000
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    date: '2024-01-16',
    prNumber: 'PR-2024-002',
    supplierName: 'XYZ Industrial Solutions',
    status: 'Approved',
    items: [
      {
        id: '1',
        stockCode: 'MT001',
        description: 'Industrial Motor',
        quantity: 1,
        uom: 'UNIT',
        unitPrice: 5000,
        amount: 5000
      }
    ],
    total: 5000
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    date: '2024-01-16',
    prNumber: 'PR-2024-002',
    supplierName: 'XYZ Industrial Solutions',
    status: 'Approved',
    items: [
      {
        id: '1',
        stockCode: 'MT001',
        description: 'Industrial Motor',
        quantity: 1,
        uom: 'UNIT',
        unitPrice: 5000,
        amount: 5000
      }
    ],
    total: 5000
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    date: '2024-01-16',
    prNumber: 'PR-2024-002',
    supplierName: 'XYZ Industrial Solutions',
    status: 'Approved',
    items: [
      {
        id: '1',
        stockCode: 'MT001',
        description: 'Industrial Motor',
        quantity: 1,
        uom: 'UNIT',
        unitPrice: 5000,
        amount: 5000
      }
    ],
    total: 5000
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    date: '2024-01-16',
    prNumber: 'PR-2024-002',
    supplierName: 'XYZ Industrial Solutions',
    status: 'Approved',
    items: [
      {
        id: '1',
        stockCode: 'MT001',
        description: 'Industrial Motor',
        quantity: 1,
        uom: 'UNIT',
        unitPrice: 5000,
        amount: 5000
      }
    ],
    total: 5000
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    date: '2024-01-16',
    prNumber: 'PR-2024-002',
    supplierName: 'XYZ Industrial Solutions',
    status: 'Approved',
    items: [
      {
        id: '1',
        stockCode: 'MT001',
        description: 'Industrial Motor',
        quantity: 1,
        uom: 'UNIT',
        unitPrice: 5000,
        amount: 5000
      }
    ],
    total: 5000
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    date: '2024-01-16',
    prNumber: 'PR-2024-002',
    supplierName: 'XYZ Industrial Solutions',
    status: 'Approved',
    items: [
      {
        id: '1',
        stockCode: 'MT001',
        description: 'Industrial Motor',
        quantity: 1,
        uom: 'UNIT',
        unitPrice: 5000,
        amount: 5000
      }
    ],
    total: 5000
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    date: '2024-01-16',
    prNumber: 'PR-2024-002',
    supplierName: 'XYZ Industrial Solutions',
    status: 'Approved',
    items: [
      {
        id: '1',
        stockCode: 'MT001',
        description: 'Industrial Motor',
        quantity: 1,
        uom: 'UNIT',
        unitPrice: 5000,
        amount: 5000
      }
    ],
    total: 5000
  },
  {
    id: 'PO003',
    poNumber: 'PO-2024-003',
    date: '2024-01-17',
    prNumber: 'PR-2024-003',
    supplierName: 'Global Parts Inc',
    status: 'Delivered',
    items: [
      {
        id: '1',
        stockCode: 'SP001',
        description: 'Spare Parts Kit',
        quantity: 5,
        uom: 'KIT',
        unitPrice: 800,
        amount: 4000
      }
    ],
    total: 4000
  }
];

export function PurchaseOrderList() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState<string>('');

  // Filter purchase orders based on search, date and status
  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      order.prNumber.toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      !date ||
      format(new Date(order.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    const matchesStatus = !status || order.status === status;

    return matchesSearch && matchesDate && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'Approved':
        return 'text-green-600 bg-green-50';
      case 'Delivered':
        return 'text-blue-600 bg-blue-50';
      case 'Completed':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>List of Purchase Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search purchase orders..."
                className="pl-8 md:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>PR Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total (RM)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.poNumber}</TableCell>
                  <TableCell>
                    {format(new Date(order.date), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>{order.prNumber}</TableCell>
                  <TableCell>{order.supplierName}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getStatusColor(order.status)
                      )}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/purchase-order/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
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
