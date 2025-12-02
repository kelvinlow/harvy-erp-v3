'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffTable } from '@/components/hr/staff-table';
import { StaffForm } from '@/components/hr/staff-form';
import { mockStaffData } from '@/data/mock-staff';
import type { Staff } from '@/types/staff';

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<Staff[]>(mockStaffData);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateStaff = (newStaff: Staff) => {
    setStaff([...staff, { ...newStaff, id: `ST${staff.length + 1001}` }]);
  };

  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaff(staff.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
    setSelectedStaff(null);
    setIsEditing(false);
  };

  const handleSuspendStaff = (staffId: string) => {
    setStaff(
      staff.map((s) => (s.id === staffId ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s)),
    );
  };

  const handleEditStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsEditing(true);
  };

  const handleResetPassword = (staffId: string) => {
    // In a real application, this would trigger an API call to reset the password
    console.log(`Password reset initiated for staff ID: ${staffId}`);
    // Show success message to user
    alert('Password reset link has been sent to the staff member\'s email.');
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground mt-2">Manage staff accounts, profiles, and access permissions</p>
      </div>

      <Tabs defaultValue="all-staff" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all-staff">All Staff</TabsTrigger>
          <TabsTrigger value="add-staff">Add New Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="all-staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Directory</CardTitle>
              <CardDescription>View and manage all staff accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <StaffTable
                staff={staff}
                onEdit={handleEditStaff}
                onSuspend={handleSuspendStaff}
                onResetPassword={handleResetPassword}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-staff">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Update staff member information' : 'Create a new staff account in the system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StaffForm
                staff={selectedStaff}
                onSubmit={isEditing ? handleUpdateStaff : handleCreateStaff}
                onCancel={() => {
                  setSelectedStaff(null);
                  setIsEditing(false);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

