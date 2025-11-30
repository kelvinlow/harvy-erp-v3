'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye, ArrowUpDown, Calendar, Package, User } from 'lucide-react';
import type { Gatepass, GatepassSortOptions } from '@/types/gatepass';
import { formatDate } from '@/lib/utils';
import StatusBadge from './status-badge';

interface GatepassTableProps {
  gatepasses: Gatepass[]
  sortOptions: GatepassSortOptions
  onSortChange: (field: keyof Gatepass | '') => void
  onViewDetail: (gatepass: Gatepass) => void
}

export default function GatepassTable({ gatepasses, sortOptions, onSortChange, onViewDetail }: GatepassTableProps) {
  const renderSortIcon = (field: keyof Gatepass | '') => {
    if (sortOptions.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortOptions.direction === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  onClick={() => onSortChange('requestNumber')}
                  className="flex items-center font-semibold"
                >
                  ID {renderSortIcon('requestNumber')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSortChange('itemName')}
                  className="flex items-center font-semibold"
                >
                  Item/Machinery {renderSortIcon('itemName')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSortChange('itemType')}
                  className="flex items-center font-semibold"
                >
                  Type {renderSortIcon('itemType')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSortChange('requestDate')}
                  className="flex items-center font-semibold"
                >
                  Request Date {renderSortIcon('requestDate')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSortChange('requestor')}
                  className="flex items-center font-semibold"
                >
                  Requestor {renderSortIcon('requestor')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSortChange('status')}
                  className="flex items-center font-semibold"
                >
                  Status {renderSortIcon('status')}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gatepasses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No gatepasses found.
                </TableCell>
              </TableRow>
            ) : (
              gatepasses.map((gatepass) => (
                <TableRow key={gatepass.id}>
                  <TableCell className="font-medium">{gatepass.requestNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{gatepass.itemName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{gatepass.itemType}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(gatepass.requestDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{gatepass.requestor.name}</div>
                        <div className="text-xs text-muted-foreground">{gatepass.requestor.department}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={gatepass.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetail(gatepass)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

