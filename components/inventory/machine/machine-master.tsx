'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MachineTable } from './machine-table';
import { MachineDialog } from './machine-dialog';
import { MachineDetail } from './machine-detail';
import { DeleteConfirmation } from '@/components/delete-confirmation';
import type { Machine, ServiceRecord } from '@/types/machine';

// Mock data
const mockMachines: Machine[] = [
  {
    id: '1',
    seqNo: 1,
    machineCode: 'OFF',
    machineName: 'OFFICE - GENERAL',
    serialNumber: 'SN12345',
    purchaseDate: '2006-09-12',
    location: 'Main Office',
    processCode: 'A',
    warrantyStartDate: '2006-09-12',
    warrantyEndDate: '2007-09-12',
    primaryContactName: 'John Doe',
    primaryContactEmail: 'john.doe@example.com',
    primaryContactPhone: '555-1234',
    nextServiceDate: '2023-12-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    seqNo: 2,
    machineCode: 'CD-JMB',
    machineName: 'CON-JMB MULTI STEEL',
    serialNumber: 'MS78901',
    purchaseDate: '2023-02-23',
    location: 'Factory Floor',
    processCode: 'B',
    warrantyStartDate: '2023-02-23',
    warrantyEndDate: '2025-02-23',
    imageUrl: '/placeholder.svg?height=300&width=400',
    primaryContactName: 'Jane Smith',
    primaryContactEmail: 'jane.smith@example.com',
    primaryContactPhone: '555-5678',
    nextServiceDate: '2023-11-30',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    seqNo: 3,
    machineCode: 'ST-CON POND',
    machineName: 'CONDENSATE POND',
    serialNumber: 'CP45678',
    purchaseDate: '2023-04-21',
    location: 'CONTRACTOR',
    processCode: 'C',
    warrantyStartDate: '2023-04-21',
    warrantyEndDate: '2024-04-21',
    primaryContactName: 'Robert Johnson',
    primaryContactEmail: 'robert.j@example.com',
    primaryContactPhone: '555-9012',
    nextServiceDate: '2023-12-05',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock service records
const mockServiceRecords: ServiceRecord[] = [
  {
    id: 'sr1',
    machineId: '2',
    serviceDate: '2023-05-15',
    description: 'Regular maintenance and oil change',
    performedBy: 'Tech Services Inc.',
    cost: 250.0,
    notes: 'Machine in good condition, replaced filters',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sr2',
    machineId: '2',
    serviceDate: '2023-08-22',
    description: 'Emergency repair - motor issue',
    performedBy: 'Quick Fix Repairs',
    cost: 750.0,
    notes: 'Replaced motor bearing and drive belt',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sr3',
    machineId: '1',
    serviceDate: '2023-07-10',
    description: 'Annual inspection',
    performedBy: 'Certified Inspectors Ltd.',
    cost: 150.0,
    notes: 'Passed all safety checks',
    createdAt: new Date().toISOString(),
  },
];

export function MachineMaster() {
  const [machines, setMachines] = React.useState<Machine[]>(mockMachines);
  const [serviceRecords, setServiceRecords] = React.useState<ServiceRecord[]>(mockServiceRecords);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedMachine, setSelectedMachine] = React.useState<Machine | null>(null);
  const [machineToDelete, setMachineToDelete] = React.useState<Machine | null>(null);
  const [viewMode, setViewMode] = React.useState<'list' | 'detail'>('list');
  const [detailMachine, setDetailMachine] = React.useState<Machine | null>(null);

  const handleCreate = () => {
    setSelectedMachine(null);
    setDialogOpen(true);
  };

  const handleEdit = (machine: Machine) => {
    setSelectedMachine(machine);
    setDialogOpen(true);
  };

  const handleDeleteClick = (machine: Machine) => {
    setMachineToDelete(machine);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (machineToDelete) {
      // In a real app, you would call an API here
      setMachines(machines.filter((machine) => machine.id !== machineToDelete.id));
      setDeleteOpen(false);
      setMachineToDelete(null);

      // If we're viewing the machine that was deleted, go back to list view
      if (detailMachine && detailMachine.id === machineToDelete.id) {
        setViewMode('list');
        setDetailMachine(null);
      }
    }
  };

  const handleSave = async (data: Partial<Machine>) => {
    if (selectedMachine) {
      // Update existing machine
      const updatedMachine = {
        ...selectedMachine,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      setMachines(machines.map((machine) => (machine.id === selectedMachine.id ? updatedMachine : machine)));

      // If we're viewing the machine that was updated, update the detail view
      if (detailMachine && detailMachine.id === selectedMachine.id) {
        setDetailMachine(updatedMachine);
      }
    } else {
      // Create new machine
      const newMachine: Machine = {
        id: Math.random().toString(36).substr(2, 9),
        seqNo: machines.length + 1,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Machine;
      setMachines([...machines, newMachine]);
    }
    setDialogOpen(false);
  };

  const handlePrintBarcode = (machine: Machine) => {
    // Implement barcode printing logic
    console.log('Print barcode for:', machine);
  };

  const handlePrintLinkStation = () => {
    // Implement link station printing logic
    console.log('Print link station');
  };

  const handleViewDetails = (machine: Machine) => {
    setDetailMachine(machine);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setDetailMachine(null);
  };

  const handleEditFromDetail = () => {
    if (detailMachine) {
      handleEdit(detailMachine);
    }
  };

  const getServiceRecordsForMachine = (machineId: string) => {
    return serviceRecords.filter((record) => record.machineId === machineId);
  };

  const handleAddServiceRecord = async (record: Omit<ServiceRecord, 'id' | 'machineId' | 'createdAt'>) => {
    if (!detailMachine) return;

    const newRecord: ServiceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      machineId: detailMachine.id,
      ...record,
      createdAt: new Date().toISOString(),
    };

    setServiceRecords([...serviceRecords, newRecord]);
  };

  const handleUpdateServiceRecord = async (id: string, data: Partial<ServiceRecord>) => {
    setServiceRecords(serviceRecords.map((record) => (record.id === id ? { ...record, ...data } : record)));
  };

  const handleDeleteServiceRecord = async (id: string) => {
    setServiceRecords(serviceRecords.filter((record) => record.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {viewMode === 'detail' && detailMachine ? (
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBackToList} className="mr-2 -ml-2">
                Back
              </Button>
              <span>Machine Details: {detailMachine.machineName}</span>
            </div>
          ) : (
            'Machine Master'
          )}
        </CardTitle>
        {viewMode === 'list' && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrintLinkStation}>
              Print Link Station
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Machine
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {viewMode === 'list' ? (
          <MachineTable
            data={machines}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onPrintBarcode={handlePrintBarcode}
            onViewDetails={handleViewDetails}
          />
        ) : detailMachine ? (
          <MachineDetail
            machine={detailMachine}
            serviceRecords={getServiceRecordsForMachine(detailMachine.id)}
            onEditMachine={handleEditFromDetail}
            onAddServiceRecord={handleAddServiceRecord}
            onUpdateServiceRecord={handleUpdateServiceRecord}
            onDeleteServiceRecord={handleDeleteServiceRecord}
          />
        ) : null}

        <MachineDialog open={dialogOpen} onOpenChange={setDialogOpen} machine={selectedMachine} onSubmit={handleSave} />

        <DeleteConfirmation
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete Machine"
          description={`Are you sure you want to delete ${machineToDelete?.machineName}? This action cannot be undone.`}
        />
      </CardContent>
    </Card>
  );
}

