'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { MobileApprovalCard, type ApprovalItem } from './mobile-approval-card';
import { Search } from 'lucide-react';

interface MobileApprovalListProps {
  pendingItems: ApprovalItem[]
  completedItems: ApprovalItem[]
  onApprove: (id: string, comments: string) => Promise<void>
  onReject: (id: string, comments: string) => Promise<void>
}

export function MobileApprovalList({ pendingItems, completedItems, onApprove, onReject }: MobileApprovalListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPendingItems = pendingItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCompletedItems = completedItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search approvals..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending ({filteredPendingItems.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filteredCompletedItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {filteredPendingItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No matching pending approvals found' : 'No pending approvals'}
            </div>
          ) : (
            filteredPendingItems.map((item) => (
              <MobileApprovalCard key={item.id} item={item} onApprove={onApprove} onReject={onReject} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-4">
          {filteredCompletedItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No matching completed approvals found' : 'No completed approvals'}
            </div>
          ) : (
            filteredCompletedItems.map((item) => (
              <MobileApprovalCard key={item.id} item={item} onApprove={onApprove} onReject={onReject} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

