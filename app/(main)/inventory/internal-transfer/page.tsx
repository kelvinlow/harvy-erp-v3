import type { Metadata } from 'next';
import { InternalTransferList } from '@/components/inventory/internal-transfer/internal-transfer-list';

export const metadata: Metadata = {
  title: 'Internal Transfer - Harvy',
  description: 'Manage internal transfer requests between companies'
};

export default function InternalTransferPage() {
  return (
    <div className="p-8">
      <InternalTransferList />
    </div>
  );
}
