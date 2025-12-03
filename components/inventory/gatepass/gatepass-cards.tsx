'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, Package, User, MapPin } from 'lucide-react';
import type { Gatepass } from '@/types/gatepass';
import { formatDate } from '@/lib/utils';
import StatusBadge from './status-badge';

interface GatepassCardsProps {
  gatepasses: Gatepass[];
  onViewDetail: (gatepass: Gatepass) => void;
  onUpdateStatus: (gatepass: Gatepass) => void;
}

export default function GatepassCards({
  gatepasses,
  onViewDetail,
  onUpdateStatus
}: GatepassCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gatepasses.length === 0 ? (
        <div className="col-span-full text-center py-8">
          No gatepasses found.
        </div>
      ) : (
        gatepasses.map((gatepass) => (
          <Card key={gatepass.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {gatepass.requestNumber}
                </CardTitle>
                <StatusBadge status={gatepass.status} />
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-3">
                <div className="flex items-start">
                  <Package className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{gatepass.itemName}</div>
                    <div className="text-sm text-muted-foreground">
                      Type: {gatepass.itemType}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {gatepass.quantity}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{gatepass.requestor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {gatepass.requestor.department}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Requested on</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(gatepass.requestDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Destination</div>
                    <div className="text-sm text-muted-foreground">
                      {gatepass.destination}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onViewDetail(gatepass)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
