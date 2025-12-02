'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { ServiceRecord } from '@/types/machine';
import { ServiceRecordDialog } from './service-record-dialog';
import { DeleteConfirmation } from '@/components/delete-confirmation';

interface ServiceHistoryProps {
  machineId: string;
  records: ServiceRecord[];
  onAddRecord: (
    record: Omit<ServiceRecord, 'id' | 'machineId' | 'createdAt'>
  ) => void;
  onUpdateRecord: (id: string, record: Partial<ServiceRecord>) => void;
  onDeleteRecord: (id: string) => void;
}

export function ServiceHistory({
  machineId,
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord
}: ServiceHistoryProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] =
    React.useState<ServiceRecord | null>(null);
  const [recordToDelete, setRecordToDelete] =
    React.useState<ServiceRecord | null>(null);

  const handleAddClick = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };

  const handleEditClick = (record: ServiceRecord) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleDeleteClick = (record: ServiceRecord) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleSaveRecord = async (data: Partial<ServiceRecord>) => {
    if (selectedRecord) {
      await onUpdateRecord(selectedRecord.id, data);
    } else {
      await onAddRecord(
        data as Omit<ServiceRecord, 'id' | 'machineId' | 'createdAt'>
      );
    }
    setDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (recordToDelete) {
      await onDeleteRecord(recordToDelete.id);
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Service History</CardTitle>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service Record
        </Button>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No service records found. Add a service record to get started.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {format(new Date(record.serviceDate), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>{record.performedBy}</TableCell>
                    <TableCell>${record.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(record)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(record)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <ServiceRecordDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          record={selectedRecord}
          onSubmit={handleSaveRecord}
        />

        <DeleteConfirmation
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          title="Delete Service Record"
          description="Are you sure you want to delete this service record? This action cannot be undone."
        />
      </CardContent>
    </Card>
  );
}
