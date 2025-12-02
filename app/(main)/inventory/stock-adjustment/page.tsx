import { StockAdjustmentForm } from '@/components/stock-adjustment-form';

export default function StockAdjustmentPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Stock Adjustment</h1>
        </div>
        <StockAdjustmentForm />
      </div>
    </div>
  );
}

