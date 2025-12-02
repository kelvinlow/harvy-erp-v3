import type { DeliveryOrderStatus } from '@/types/delivery-order';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: DeliveryOrderStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      variant: 'outline' as const,
      className: 'border-yellow-500 text-yellow-700 bg-yellow-50',
    },
    'in-transit': {
      label: 'In Transit',
      variant: 'outline' as const,
      className: 'border-blue-500 text-blue-700 bg-blue-50',
    },
    delivered: {
      label: 'Delivered',
      variant: 'outline' as const,
      className: 'border-green-500 text-green-700 bg-green-50',
    },
    cancelled: {
      label: 'Cancelled',
      variant: 'outline' as const,
      className: 'border-red-500 text-red-700 bg-red-50',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

