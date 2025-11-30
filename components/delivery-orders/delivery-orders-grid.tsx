'use client';

import { format } from 'date-fns';
import { Calendar, Eye, Package, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { DeliveryOrder } from '@/types/delivery-order';
import { StatusBadge } from './status-badge';

interface DeliveryOrdersGridProps {
  orders: DeliveryOrder[]
}

export function DeliveryOrdersGrid({ orders }: DeliveryOrdersGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
            <div>
              <div className="font-semibold">{order.id}</div>
              <div className="text-sm text-muted-foreground">{order.supplier.name}</div>
            </div>
            <StatusBadge status={order.status} />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(order.expectedArrival), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>{order.items.length} items</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Items</div>
              <ul className="text-sm space-y-1">
                {order.items.slice(0, 3).map((item) => (
                  <li key={`${order.id}-${item.code}`} className="flex justify-between">
                    <span className="truncate max-w-[180px]">{item.name}</span>
                    <span className="text-muted-foreground">
                      {item.quantity} {item.uom}
                    </span>
                  </li>
                ))}
                {order.items.length > 3 && (
                  <li className="text-muted-foreground text-xs">+ {order.items.length - 3} more items</li>
                )}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <div className="text-xs text-muted-foreground">
              {order.status === 'delivered'
                ? `Delivered on ${format(new Date(order.actualArrival || order.expectedArrival), 'MMM dd, yyyy')}`
                : `Expected ${format(new Date(order.expectedArrival), 'MMM dd, yyyy')}`}
            </div>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>View</span>
            </Button>
          </CardFooter>
        </Card>
      ))}

      {orders.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <Truck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No delivery orders found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}

