'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Staff } from '@/types/staff';
import { MoreHorizontal, Search, UserCog, UserMinus, UserPlus, KeyRound, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StaffTableProps {
  staff: Staff[]
  onEdit: (staff: Staff) => void
  onSuspend: (staffId: string) => void
  onResetPassword: (staffId: string) => void
}

export function StaffTable({ staff, onEdit, onSuspend, onResetPassword }: StaffTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'suspend' | 'reset' | null
    staff: Staff | null
  }>({ type: null, staff: null });

  // Filter staff based on search term and filters
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || s.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = Array.from(new Set(staff.map((s) => s.department)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-md">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Department</label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Position</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No staff members found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell className="font-medium">{staffMember.name}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{staffMember.position}</TableCell>
                  <TableCell className="hidden md:table-cell">{staffMember.department}</TableCell>
                  <TableCell>
                    <Badge variant={staffMember.status === 'active' ? 'success' : 'destructive'}>
                      {staffMember.status === 'active' ? 'Active' : 'Suspended'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(staffMember)}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setConfirmAction({
                              type: 'suspend',
                              staff: staffMember,
                            })
                          }
                        >
                          {staffMember.status === 'active' ? (
                            <>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Suspend Account
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Reactivate Account
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setConfirmAction({
                              type: 'reset',
                              staff: staffMember,
                            })
                          }
                        >
                          <KeyRound className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmAction.type !== null} onOpenChange={() => setConfirmAction({ type: null, staff: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction.type === 'suspend'
                ? confirmAction.staff?.status === 'active'
                  ? 'Suspend Staff Account'
                  : 'Reactivate Staff Account'
                : 'Reset Password'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction.type === 'suspend'
                ? confirmAction.staff?.status === 'active'
                  ? "This will suspend the staff member's access to the system. They will not be able to log in until reactivated."
                  : "This will restore the staff member's access to the system."
                : "This will send a password reset link to the staff member's email address."}
            </DialogDescription>
          </DialogHeader>

          {confirmAction.staff && (
            <div className="py-4">
              <p className="font-medium">{confirmAction.staff.name}</p>
              <p className="text-sm text-muted-foreground">{confirmAction.staff.email}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction({ type: null, staff: null })}>
              Cancel
            </Button>
            <Button
              variant={
                confirmAction.type === 'suspend' && confirmAction.staff?.status === 'active' ? 'destructive' : 'default'
              }
              onClick={() => {
                if (confirmAction.type === 'suspend' && confirmAction.staff) {
                  onSuspend(confirmAction.staff.id);
                } else if (confirmAction.type === 'reset' && confirmAction.staff) {
                  onResetPassword(confirmAction.staff.id);
                }
                setConfirmAction({ type: null, staff: null });
              }}
            >
              {confirmAction.type === 'suspend'
                ? confirmAction.staff?.status === 'active'
                  ? 'Suspend Account'
                  : 'Reactivate Account'
                : 'Send Reset Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

