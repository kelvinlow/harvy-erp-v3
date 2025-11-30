'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StaffMember } from '@/types/staff-directory';
import { MoreHorizontal, Search, Edit, Trash2, Filter, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StaffDetail } from './staff-detail';

interface StaffTableProps {
  staff: StaffMember[]
  onEdit: (staff: StaffMember) => void
  onDelete: (staffId: string) => void
}

export function StaffTable({ staff, onEdit, onDelete }: StaffTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<StaffMember | null>(null);
  const [viewStaff, setViewStaff] = useState<StaffMember | null>(null);

  // Filter staff based on search term and filters
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.nric && s.nric.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDepartment = departmentFilter === 'all' || s.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = Array.from(new Set(staff.map((s) => s.department)));

  // Get manager name for a staff member
  const getManagerName = (managerId: string | null) => {
    if (!managerId) return 'None';
    const manager = staff.find((s) => s.id === managerId);
    return manager ? manager.fullName : 'Unknown';
  };

  // Get initials from full name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, NRIC..."
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
              <TableHead>Staff</TableHead>
              <TableHead className="hidden md:table-cell">NRIC</TableHead>
              <TableHead className="hidden md:table-cell">Position</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Reports To</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={staffMember.photoUrl || ''} alt={staffMember.fullName} />
                        <AvatarFallback>{getInitials(staffMember.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{staffMember.fullName}</div>
                        <div className="text-sm text-muted-foreground">{staffMember.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {staffMember.nric
                      ? `${staffMember.nric.substring(0, 5)}****${staffMember.nric.substring(staffMember.nric.length - 1)}`
                      : 'Not provided'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{staffMember.position}</TableCell>
                  <TableCell className="hidden md:table-cell">{staffMember.department}</TableCell>
                  <TableCell className="hidden lg:table-cell">{getManagerName(staffMember.managerId)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewStaff(staffMember)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(staffMember)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setConfirmDelete(staffMember)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Profile
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staff Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this staff profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {confirmDelete && (
            <div className="py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={confirmDelete.photoUrl || ''} alt={confirmDelete.fullName} />
                  <AvatarFallback>{getInitials(confirmDelete.fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{confirmDelete.fullName}</p>
                  <p className="text-sm text-muted-foreground">{confirmDelete.position}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDelete) {
                  onDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }
              }}
            >
              Delete Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Staff Profile Dialog */}
      {viewStaff && (
        <Dialog open={viewStaff !== null} onOpenChange={(open) => !open && setViewStaff(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Staff Profile</DialogTitle>
            </DialogHeader>
            <StaffDetail
              staff={viewStaff}
              allStaff={staff}
              onEdit={() => {
                onEdit(viewStaff);
                setViewStaff(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

