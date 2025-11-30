import { Badge } from '@/components/ui/badge';
import type { GatepassStatus } from '@/types/gatepass';

interface StatusBadgeProps {
  status: GatepassStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: GatepassStatus) => {
    switch (status) {
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Out':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'Returned':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Replaced':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} font-medium`} variant="outline">
      {status}
    </Badge>
  );
}

