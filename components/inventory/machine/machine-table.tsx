'use client';

import { useState } from 'react';
import { Edit2, Search, Trash2, Printer, Eye } from 'lucide-react';
import { format, isAfter } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Machine } from '@/types/machine';

interface MachineTableProps {
  data: Machine[];
  onEdit: (machine: Machine) => void;
  onDelete: (machine: Machine) => void;
  onPrintBarcode: (machine: Machine) => void;
  onViewDetails: (machine: Machine) => void;
}

export function MachineTable({
  data,
  onEdit,
  onDelete,
  onPrintBarcode,
  onViewDetails
}: MachineTableProps) {
  const [search, setSearch] = useState('');

  const filteredData = data.filter(
    (machine) =>
      machine.machineCode.toLowerCase().includes(search.toLowerCase()) ||
      machine.machineName.toLowerCase().includes(search.toLowerCase()) ||
      machine.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      machine.location.toLowerCase().includes(search.toLowerCase()) ||
      (machine.primaryContactName &&
        machine.primaryContactName.toLowerCase().includes(search.toLowerCase()))
  );

  const getWarrantyStatus = (machine: Machine) => {
    if (!machine.warrantyEndDate) return null;
    return isAfter(new Date(machine.warrantyEndDate), new Date());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search machines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Machine Code</TableHead>
              <TableHead>Machine Name</TableHead>
              <TableHead>Serial No</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Warranty</TableHead>
              <TableHead>Next Service</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead className="w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">
                  {machine.machineCode}
                </TableCell>
                <TableCell>{machine.machineName}</TableCell>
                <TableCell>{machine.serialNumber}</TableCell>
                <TableCell>{machine.location}</TableCell>
                <TableCell>
                  {machine.warrantyEndDate ? (
                    <div className="flex flex-col">
                      <Badge
                        variant={
                          getWarrantyStatus(machine) ? 'default' : 'destructive'
                        }
                        className="w-fit"
                      >
                        {getWarrantyStatus(machine) ? 'In Warranty' : 'Expired'}
                      </Badge>
                      <span className="text-xs text-muted-foreground mt-1">
                        Until{' '}
                        {format(
                          new Date(machine.warrantyEndDate),
                          'dd MMM yyyy'
                        )}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not specified</span>
                  )}
                </TableCell>
                <TableCell>
                  {machine.nextServiceDate ? (
                    format(new Date(machine.nextServiceDate), 'dd MMM yyyy')
                  ) : (
                    <span className="text-muted-foreground">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell>
                  {machine.primaryContactName || (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(machine)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(machine)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(machine)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPrintBarcode(machine)}
                      title="Print Barcode"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
