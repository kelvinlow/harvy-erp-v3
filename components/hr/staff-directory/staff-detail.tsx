'use client';

import { Button } from '@/components/ui/button';
import type { StaffMember } from '@/types/staff-directory';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Mail, Phone, Building, Users } from 'lucide-react';

interface StaffDetailProps {
  staff: StaffMember
  allStaff: StaffMember[]
  onEdit: () => void
}

export function StaffDetail({ staff, allStaff, onEdit }: StaffDetailProps) {
  // Get manager details
  const manager = staff.managerId ? allStaff.find((s) => s.id === staff.managerId) : null;

  // Get direct reports
  const directReports = allStaff.filter((s) => s.managerId === staff.id);

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-24 w-24">
          <AvatarImage src={staff.photoUrl || ''} alt={staff.fullName} />
          <AvatarFallback className="text-lg">{getInitials(staff.fullName)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{staff.fullName}</h2>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          <p className="text-lg text-muted-foreground">{staff.position}</p>

          <div className="flex flex-wrap gap-y-2 gap-x-6 mt-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{staff.email}</span>
            </div>
            {staff.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{staff.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{staff.department}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">NRIC</h3>
          <p className="text-muted-foreground">
            {staff.nric
              ? `${staff.nric.substring(0, 5)}****${staff.nric.substring(staff.nric.length - 1)}`
              : 'Not provided'}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Reports To</h3>
          {manager ? (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={manager.photoUrl || ''} alt={manager.fullName} />
                <AvatarFallback>{getInitials(manager.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{manager.fullName}</p>
                <p className="text-sm text-muted-foreground">{manager.position}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No manager assigned</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Users className="h-5 w-5" />
          Direct Reports ({directReports.length})
        </h3>

        {directReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {directReports.map((report) => (
              <div key={report.id} className="flex items-center gap-3 p-3 rounded-md border">
                <Avatar>
                  <AvatarImage src={report.photoUrl || ''} alt={report.fullName} />
                  <AvatarFallback>{getInitials(report.fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{report.fullName}</p>
                  <p className="text-sm text-muted-foreground">{report.position}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No direct reports</p>
        )}
      </div>
    </div>
  );
}

