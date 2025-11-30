import { PurchaseRequisitionList } from '@/components/purchasing/purchase-requisition/purchase-requistion-list';

export default function PurchaseRequisitionListPage() {
  return (
    <div className="flex flex-1 flex-col p-8 lg:p-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Purchase Requisitions</h1>
        </div>
        <PurchaseRequisitionList />
      </div>
    </div>
  );
}
