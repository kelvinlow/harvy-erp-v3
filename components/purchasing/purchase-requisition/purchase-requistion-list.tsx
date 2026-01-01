'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Download,
  Printer,
  Search,
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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
  id: string | number;
  prNumber: string;
  company: string;
  createdAt: string;
  status: string;
  poNumber: string | null;
}

export function PurchaseRequisitionList() {
  const [purchaseRequisitions, setPurchaseRequisitions] = useState<
    PurchaseRequisition[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState<string>('');
  const [company, setCompany] = useState<string>('');

  useEffect(() => {
    async function fetchPRs() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api/v1'
          }/purchase-requisitions`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch purchase requisitions');
        }

        const result = await response.json();
        setPurchaseRequisitions(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load purchase requisitions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPRs();
  }, []);

  // Filter purchase requisitions based on search, date, status, and company
  const filteredRequisitions = purchaseRequisitions.filter((pr) => {
    const matchesSearch =
      pr.prNumber.toLowerCase().includes(search.toLowerCase()) ||
      pr.company.toLowerCase().includes(search.toLowerCase()) ||
      (pr.poNumber && pr.poNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesDate =
      !date ||
      format(new Date(pr.createdAt), 'yyyy-MM-dd') ===
        format(date, 'yyyy-MM-dd');

    const matchesStatus =
      !status || pr.status === status || (status === 'all' && true);

    const matchesCompany =
      !company || pr.company === company || (company === 'all' && true);

    return matchesSearch && matchesDate && matchesStatus && matchesCompany;
  });

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'APPROVED':
        return 'text-green-600 bg-green-50';
      case 'REJECTED':
        return 'text-red-600 bg-red-50';
      case 'COMPLETED':
        return 'text-blue-600 bg-blue-50';
      case 'MANAGER_APPROVAL':
        return 'text-purple-600 bg-purple-50';
      case 'PARTIAL':
        return 'text-orange-600 bg-orange-50';
      case 'DRAFT':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex h-64 flex-col items-center justify-center gap-4 text-destructive">
          <AlertCircle className="h-10 w-10" />
          <p>{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

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
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="MANAGER_APPROVAL">Manager Approval</SelectItem>
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
                    {format(new Date(pr.createdAt), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getStatusColor(pr.status)
                      )}
                    >
                      {formatStatus(pr.status)}
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
