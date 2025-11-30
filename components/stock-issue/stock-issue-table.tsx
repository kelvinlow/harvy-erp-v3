'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

interface StockIssueTableProps {
  items: any[]
  onRemove: (id: number) => void
}

export function StockIssueTable({ items, onRemove }: StockIssueTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stock Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>UOM</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.stockCode}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.uom}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No items added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

