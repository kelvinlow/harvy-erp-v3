'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { StockItem } from '@/types/stock-ledger';

interface StockLedgerCardProps {
  item: StockItem
}

export function StockLedgerCard({ item }: StockLedgerCardProps) {
  let runningQuantity = item.openingBalance.quantity;
  let runningAmount = item.openingBalance.amount;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-base font-medium">
          {item.code} - {item.description}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead className="w-[120px]">Transaction</TableHead>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[80px] text-right">Qty In</TableHead>
                <TableHead className="w-[80px] text-right">Qty Out</TableHead>
                <TableHead className="w-[100px] text-right">Balance</TableHead>
                <TableHead className="w-[120px] text-right">Amount (RM)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="bg-muted/30 font-medium">
                  Opening Balance: {item.openingBalance.quantity.toFixed(2)} units (RM{' '}
                  {item.openingBalance.amount.toFixed(2)})
                </TableCell>
              </TableRow>
              {item.transactions.map((transaction) => {
                runningQuantity += transaction.quantityIn - transaction.quantityOut;
                runningAmount += transaction.amountIn - transaction.amountOut;

                return (
                  <TableRow key={transaction.transactionNo}>
                    <TableCell>{transaction.no}</TableCell>
                    <TableCell>{transaction.transactionNo}</TableCell>
                    <TableCell>{format(transaction.date, 'dd MMM yyyy')}</TableCell>
                    <TableCell className="text-right">{transaction.quantityIn.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{transaction.quantityOut.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{runningQuantity.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{runningAmount.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={7} className="bg-muted/30 font-medium">
                  Closing Balance: {runningQuantity.toFixed(2)} units (RM {runningAmount.toFixed(2)})
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

