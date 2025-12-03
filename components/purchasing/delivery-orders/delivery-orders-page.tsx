'use client';

import { useState } from 'react';
import { Calendar, Search, SortAsc, SortDesc, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeliveryOrdersTable } from './delivery-orders-table';
import { DeliveryOrdersGrid } from './delivery-orders-grid';
import { DateRangePicker } from './date-range-picker';
import { mockDeliveryOrders } from '@/data/mock-delivery-orders';
import type { DeliveryOrderStatus } from '@/types/delivery-order';
import { DateRange } from 'react-day-picker';

export function DeliveryOrdersPage() {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryOrderStatus | 'all'>(
    'all'
  );
  const [sortField, setSortField] = useState<'date' | 'id'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });

  // Filter and sort delivery orders
  const filteredOrders = mockDeliveryOrders
    .filter((order) => {
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      // Date range filter
      if (dateRange.from && new Date(order.expectedArrival) < dateRange.from) {
        return false;
      }
      if (dateRange.to && new Date(order.expectedArrival) > dateRange.to) {
        return false;
      }

      // Search query filter (search in order ID, supplier name, and items)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesOrderId = order.id.toLowerCase().includes(query);
        const matchesSupplier = order.supplier.name
          .toLowerCase()
          .includes(query);
        const matchesItems = order.items.some(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.code.toLowerCase().includes(query)
        );

        return matchesOrderId || matchesSupplier || matchesItems;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected field and direction
      if (sortField === 'date') {
        const dateA = new Date(a.expectedArrival).getTime();
        const dateB = new Date(b.expectedArrival).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'asc'
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id);
      }
    });

  // Toggle sort direction
  const toggleSort = (field: 'date' | 'id') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Delivery Orders</h1>
          <p className="text-muted-foreground">
            Manage and track incoming inventory deliveries
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <span>New Delivery Order</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders, items or suppliers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as DeliveryOrderStatus | 'all')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />

            <Button variant="outline" onClick={clearFilters} className="h-10">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={view}
        onValueChange={(v) => setView(v as 'table' | 'grid')}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('date')}
              className="flex items-center gap-1"
            >
              <Calendar className="h-4 w-4" />
              <span>Date</span>
              {sortField === 'date' &&
                (sortDirection === 'asc' ? (
                  <SortAsc className="h-3 w-3" />
                ) : (
                  <SortDesc className="h-3 w-3" />
                ))}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('id')}
              className="flex items-center gap-1"
            >
              <span>Order ID</span>
              {sortField === 'id' &&
                (sortDirection === 'asc' ? (
                  <SortAsc className="h-3 w-3" />
                ) : (
                  <SortDesc className="h-3 w-3" />
                ))}
            </Button>

            <span className="text-sm text-muted-foreground ml-2">
              {filteredOrders.length} orders found
            </span>
          </div>

          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="grid">Card View</TabsTrigger>
          </TabsList>
        </div>

        <div>
          <TabsContent value="table" className="mt-0">
            <DeliveryOrdersTable orders={filteredOrders} />
          </TabsContent>

          <TabsContent value="grid" className="mt-0">
            <DeliveryOrdersGrid orders={filteredOrders} />
          </TabsContent>

          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Truck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No delivery orders found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
