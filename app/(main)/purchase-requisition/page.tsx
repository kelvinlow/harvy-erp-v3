import { PurchaseRequisitionList } from '@/components/purchasing/purchase-requisition/purchase-requistion-list';

export default function PurchaseRequisitionListPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <PurchaseRequisitionList />
        </div>
      </div>
    </div>
  );
}
