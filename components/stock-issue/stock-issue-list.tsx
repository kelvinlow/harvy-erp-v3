'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Trash2, FileText, Filter } from 'lucide-react';
import { mockStockIssues } from '@/data/mock-stock-issues';
import type { StockIssue } from '@/types/stock-issue';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function StockIssueList() {
  const [issues, setIssues] = useState<StockIssue[]>(mockStockIssues);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [department, setDepartment] = useState('all');

  const itemsPerPage = 5;

  // Filter issues based on search term, status, date range, and department
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.issueNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.issueTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.items.some(
        (item) =>
          item.stockCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;

    const matchesDepartment = department === 'all' || issue.issueTo === department;

    const issueDate = new Date(issue.issueDate);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;

    const matchesDateRange = (!fromDate || issueDate >= fromDate) && (!toDate || issueDate <= toDate);

    return matchesSearch && matchesStatus && matchesDepartment && matchesDateRange;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = filteredIssues.slice(startIndex, startIndex + itemsPerPage);

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ from: '', to: '' });
    setDepartment('all');
    setCurrentPage(1);
  };

  // Delete issue
  const deleteIssue = (id: string) => {
    setIssues(issues.filter((issue) => issue.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stock Issues</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Issue
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by issue number, item, or department"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-1 block">From Date</label>
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">To Date</label>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Department</label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Quality Control">Quality Control</SelectItem>
                    <SelectItem value="R&D">R&D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedIssues.length > 0 ? (
                paginatedIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">{issue.issueNumber}</TableCell>
                    <TableCell>{new Date(issue.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{issue.issueTo}</TableCell>
                    <TableCell>{issue.items.length} items</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(issue.status) as any}>
                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete issue {issue.issueNumber}? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button variant="destructive" onClick={() => deleteIssue(issue.id)}>
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No stock issues found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink isActive={currentPage === page} onClick={() => setCurrentPage(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}

