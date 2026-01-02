'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Download,
  Printer,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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

interface PurchaseOrder {
  id: number;
  poNumber: string;
  orderDate: string;
  prNumber: string | null;
  supplier: {
    id: number;
    name: string;
  };
  status: string;
  totalAmount: number;
}

export function PurchaseOrderList() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    async function fetchPOs() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(
          'https://havys-erp-worker-production.lowshinsheng.workers.dev/api/v1/purchase-orders',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch purchase orders');
        }

        const result = await response.json();
        setPurchaseOrders(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load purchase orders');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPOs();
  }, []);

  // Filter purchase orders based on search, date and status
  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order?.poNumber?.toLowerCase().includes(search.toLowerCase()) ||
      order?.supplier?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order?.prNumber?.toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      !date ||
      (order.orderDate &&
        format(new Date(order.orderDate), 'yyyy-MM-dd') ===
          format(date, 'yyyy-MM-dd'));

    const matchesStatus =
      !status || status === 'all' || order.status === status;

    return matchesSearch && matchesDate && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'APPROVED':
        return 'text-green-600 bg-green-50';
      case 'SENT':
        return 'text-blue-600 bg-blue-50';
      case 'PARTIAL':
        return 'text-orange-600 bg-orange-50';
      case 'COMPLETED':
        return 'text-blue-600 bg-blue-50';
      case 'DRAFT':
        return 'text-gray-600 bg-gray-50';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex h-64 flex-col items-center justify-center gap-4 text-destructive">
          <AlertCircle className="h-10 w-10" />
          <p>{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

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
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="PARTIAL">Partial</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                  <TableCell className="font-medium">
                    {order.poNumber}
                  </TableCell>
                  <TableCell>
                    {order.orderDate
                      ? format(new Date(order.orderDate), 'dd MMM yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>{order.prNumber || '-'}</TableCell>
                  <TableCell>{order.supplier?.name}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getStatusColor(order.status)
                      )}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
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
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No purchase orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
