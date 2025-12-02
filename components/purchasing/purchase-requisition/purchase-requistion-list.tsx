'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Download, Printer, Search, Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
interface PurchaseRequisition {
  id: string;
  prNumber: string;
  company: string;
  date: string;
  status: string;
  poNumber: string | null;
}

// Mock data
const purchaseRequisitions: PurchaseRequisition[] = [
  {
    id: 'PR001',
    prNumber: 'PR-2024-001',
    company: 'HAVYS OIL MILL',
    date: '2024-01-10',
    status: 'Pending',
    poNumber: null
  },
  {
    id: 'PR002',
    prNumber: 'PR-2024-002',
    company: 'GREEN PLANT',
    date: '2024-01-12',
    status: 'Approved',
    poNumber: 'PO-2024-001'
  },
  {
    id: 'PR003',
    prNumber: 'PR-2024-003',
    company: 'HAVYS OIL MILL',
    date: '2024-01-15',
    status: 'Rejected',
    poNumber: null
  },
  {
    id: 'PR004',
    prNumber: 'PR-2024-004',
    company: 'PARAMOUNT',
    date: '2024-01-18',
    status: 'Completed',
    poNumber: 'PO-2024-002'
  },
  {
    id: 'PR005',
    prNumber: 'PR-2024-005',
    company: 'HAVYS OIL MILL',
    date: '2024-01-20',
    status: 'Manager Approval',
    poNumber: null
  }
];

export function PurchaseRequisitionList() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState<string>('');
  const [company, setCompany] = useState<string>('');

  // Filter purchase requisitions based on search, date, status, and company
  const filteredRequisitions = purchaseRequisitions.filter((pr) => {
    const matchesSearch =
      pr.prNumber.toLowerCase().includes(search.toLowerCase()) ||
      pr.company.toLowerCase().includes(search.toLowerCase()) ||
      (pr.poNumber && pr.poNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesDate =
      !date ||
      format(new Date(pr.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');

    const matchesStatus = !status || pr.status === status;

    const matchesCompany = !company || pr.company === company;

    return matchesSearch && matchesDate && matchesStatus && matchesCompany;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'Approved':
        return 'text-green-600 bg-green-50';
      case 'Rejected':
        return 'text-red-600 bg-red-50';
      case 'Completed':
        return 'text-blue-600 bg-blue-50';
      case 'Manager Approval':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>List of Purchase Requisitions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2" asChild>
              <Link href="/purchasing/purchase-requisition/create">
                <Plus className="h-4 w-4" />
                Create
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-start">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search purchase requisitions..."
              className="pl-8 md:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Manager Approval">Manager Approval</SelectItem>
            </SelectContent>
          </Select>
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="HAVYS OIL MILL">HAVYS OIL MILL</SelectItem>
              <SelectItem value="GREEN PLANT">GREEN PLANT</SelectItem>
              <SelectItem value="PARAMOUNT">PARAMOUNT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PR Number</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequisitions.map((pr) => (
                <TableRow key={pr.id}>
                  <TableCell>{pr.prNumber}</TableCell>
                  <TableCell>{pr.company}</TableCell>
                  <TableCell>
                    {format(new Date(pr.date), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getStatusColor(pr.status)
                      )}
                    >
                      {pr.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {pr.poNumber ? (
                      <Link
                        href={`/purchase-order/${pr.poNumber}`}
                        className="text-primary hover:underline"
                      >
                        {pr.poNumber}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/purchase-requisition/${pr.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRequisitions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No purchase requisitions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
