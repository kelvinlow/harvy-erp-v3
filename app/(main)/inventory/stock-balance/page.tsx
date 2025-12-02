import type { Metadata } from 'next';
import StockBalanceView from '@/components/inventory/stock-balance/stock-balance-view';

export const metadata: Metadata = {
  title: 'Stock Balance',
  description: 'View and manage current stock balances',
};

export default function StockBalancePage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <StockBalanceView />
        </div>
      </div>
    </div>
  );
}

