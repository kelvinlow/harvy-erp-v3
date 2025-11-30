'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { DeliveryOrder } from '@/types/delivery-order';
import { StatusBadge } from './status-badge';

interface DeliveryOrdersTableProps {
  orders: DeliveryOrder[]
}

export function DeliveryOrdersTable({ orders }: DeliveryOrdersTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (orderId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Expected Arrival</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <>
              <TableRow key={order.id} className="group">
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRow(order.id)}>
                    {expandedRows[order.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.supplier.name}</TableCell>
                <TableCell>{format(new Date(order.expectedArrival), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>{order.items.length} items</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>

              {expandedRows[order.id] && (
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={7} className="p-0">
                    <div className="p-4">
                      <h4 className="font-medium mb-2">Order Items</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>UOM</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item) => (
                            <TableRow key={`${order.id}-${item.code}`}>
                              <TableCell className="font-mono text-sm">{item.code}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.uom}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-1">Delivery Notes</h5>
                          <p className="text-sm text-muted-foreground">{order.notes || 'No notes provided'}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-1">Supplier Details</h5>
                          <p className="text-sm text-muted-foreground">
                            {order.supplier.name}
                            <br />
                            {order.supplier.contact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}

          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No delivery orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

