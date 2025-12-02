import type { Metadata } from 'next';
import { InternalTransferList } from '@/components/inventory/internal-transfer/internal-transfer-list';

export const metadata: Metadata = {
  title: 'Internal Transfer - Harvy',
  description: 'Manage internal transfer requests between companies'
};

export default function InternalTransferPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <InternalTransferList />
        </div>
      </div>
    </div>
  );
}
