import { StockIssueList } from '@/components/stock-issue/stock-issue-list';

import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Stock Issue - Harvy' };

export default function StockIssuePage() {
  return (
    <div className="min-h-screen p-8">
      <StockIssueList />
    </div>
  );
}
