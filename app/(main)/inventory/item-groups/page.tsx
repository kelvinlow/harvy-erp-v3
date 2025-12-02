import { ItemGroupManagement } from '@/components/inventory/item-groups/item-group-management';

import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Item Groups - Harvy' };

export default function ItemGroupsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <ItemGroupManagement />
        </div>
      </div>
    </div>
  );
}
