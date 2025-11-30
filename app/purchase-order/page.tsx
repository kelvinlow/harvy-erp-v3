import { PurchaseOrderList } from '@/components/purchasing/purchase-order/purchase-order-list';

export default function PurchaseOrderPage() {
  return (
    <div className="space-y-6 space-x-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Purchase Requisitions</h1>
      </div>
      <PurchaseOrderList />
    </div>
  );
}

