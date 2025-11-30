'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MobileApprovalList } from './mobile-approval-list';
import type { ApprovalItem } from './mobile-approval-card';

interface MobileApprovalContainerProps {
  pendingItems: ApprovalItem[]
  completedItems: ApprovalItem[]
}

export function MobileApprovalContainer({
  pendingItems: initialPendingItems,
  completedItems: initialCompletedItems,
}: MobileApprovalContainerProps) {
  const [pendingItems, setPendingItems] = useState<ApprovalItem[]>(initialPendingItems);
  const [completedItems, setCompletedItems] = useState<ApprovalItem[]>(initialCompletedItems);
  const { toast } = useToast();

  const handleApprove = async (id: string, comments: string) => {
    // In a real application, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    // Update local state
    const itemToApprove = pendingItems.find((item) => item.id === id);
    if (itemToApprove) {
      const updatedItem = { ...itemToApprove, status: 'APPROVED' as const };

      setPendingItems(pendingItems.filter((item) => item.id !== id));
      setCompletedItems([updatedItem, ...completedItems]);

      toast({
        title: 'Approved successfully',
        description: `${updatedItem.type === 'PURCHASE_REQUISITION' ? 'Requisition' : 'Purchase Order'} ${id} has been approved.`,
      });
    }
  };

  const handleReject = async (id: string, comments: string) => {
    // In a real application, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    // Update local state
    const itemToReject = pendingItems.find((item) => item.id === id);
    if (itemToReject) {
      const updatedItem = { ...itemToReject, status: 'REJECTED' as const };

      setPendingItems(pendingItems.filter((item) => item.id !== id));
      setCompletedItems([updatedItem, ...completedItems]);

      toast({
        title: 'Rejected',
        description: `${updatedItem.type === 'PURCHASE_REQUISITION' ? 'Requisition' : 'Purchase Order'} ${id} has been rejected.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <MobileApprovalList
      pendingItems={pendingItems}
      completedItems={completedItems}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}

