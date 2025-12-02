import { StockIssueList } from '@/components/purchasing/stock-issue/stock-issue-list';

import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Stock Issue - Harvy' };

export default function StockIssuePage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <StockIssueList />
        </div>
      </div>
    </div>
  );
}
