import { Badge } from '@/components/ui/badge';
import type { TransferStatus } from '@/types/internal-transfer';
import { cn } from '@/lib/utils';

const statusConfig: Record<
  TransferStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  draft: { label: 'Draft', variant: 'outline' },
  pending: { label: 'Pending', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  shipped: { label: 'Shipped', variant: 'default' },
  received: { label: 'Received', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

interface StatusBadgeProps {
  status: TransferStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}

