import { StockLedgerView } from '@/components/inventory/stock-ledger/stock-ledger-view';

import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Stock Ledger - Harvy' };

export default function StockLedgerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StockLedgerView />
    </div>
  );
}
