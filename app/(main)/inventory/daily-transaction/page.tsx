'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { TransactionReportDialog } from '@/components/transaction-report-dialog';

const queryClient = new QueryClient();

export default function DailyTransactionPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen to-emerald-50 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Daily Transaction</h1>
          <Button onClick={() => setDialogOpen(true)}>
            View Transaction Report
          </Button>
        </div>

        <TransactionReportDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </QueryClientProvider>
  );
}
