'use client';
import { format, isAfter } from 'date-fns';
import { Calendar, Clock, MapPin, User, Mail, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceHistory } from './service-history';
import type { Machine, ServiceRecord } from '@/types/machine';

interface MachineDetailProps {
  machine: Machine
  serviceRecords: ServiceRecord[]
  onEditMachine: () => void
  onAddServiceRecord: (record: Omit<ServiceRecord, 'id' | 'machineId' | 'createdAt'>) => void
  onUpdateServiceRecord: (id: string, record: Partial<ServiceRecord>) => void
  onDeleteServiceRecord: (id: string) => void
}

export function MachineDetail({
  machine,
  serviceRecords,
  onEditMachine,
  onAddServiceRecord,
  onUpdateServiceRecord,
  onDeleteServiceRecord,
}: MachineDetailProps) {
  const isWarrantyValid = machine.warrantyEndDate ? isAfter(new Date(machine.warrantyEndDate), new Date()) : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          {machine.imageUrl ? (
            <div className="rounded-md overflow-hidden border">
              <img
                src={machine.imageUrl || '/placeholder.svg'}
                alt={machine.machineName}
                className="w-full h-auto object-cover"
              />
            </div>
          ) : (
            <div className="rounded-md border bg-muted/30 flex items-center justify-center h-48">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>

        <div className="md:w-2/3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{machine.machineName}</CardTitle>
              <Button onClick={onEditMachine}>Edit Machine</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Machine Code</div>
                  <div className="font-medium">{machine.machineCode}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Serial Number</div>
                  <div className="font-medium">{machine.serialNumber || 'N/A'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Purchase Date</div>
                  <div className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(machine.purchaseDate), 'dd MMM yyyy')}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {machine.location || 'N/A'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Process Code</div>
                  <div className="font-medium">{machine.processCode || 'N/A'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Next Service</div>
                  <div className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {machine.nextServiceDate
                      ? format(new Date(machine.nextServiceDate), 'dd MMM yyyy')
                      : 'Not scheduled'}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Warranty Status</div>
                  <Badge variant={isWarrantyValid ? 'default' : 'destructive'}>
                    {isWarrantyValid ? 'In Warranty' : 'Expired'}
                  </Badge>
                </div>
                {machine.warrantyStartDate && machine.warrantyEndDate && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(new Date(machine.warrantyStartDate), 'dd MMM yyyy')} -{' '}
                    {format(new Date(machine.warrantyEndDate), 'dd MMM yyyy')}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t">
                <div className="text-sm font-medium mb-2">Primary Contact</div>
                {machine.primaryContactName ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{machine.primaryContactName}</span>
                    </div>
                    {machine.primaryContactEmail && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{machine.primaryContactEmail}</span>
                      </div>
                    )}
                    {machine.primaryContactPhone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{machine.primaryContactPhone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No primary contact assigned</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ServiceHistory
        machineId={machine.id}
        records={serviceRecords}
        onAddRecord={onAddServiceRecord}
        onUpdateRecord={onUpdateServiceRecord}
        onDeleteRecord={onDeleteServiceRecord}
      />
    </div>
  );
}

