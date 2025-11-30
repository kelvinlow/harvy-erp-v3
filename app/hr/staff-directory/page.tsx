'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffTable } from '@/components/hr/staff-directory/staff-table';
import { StaffForm } from '@/components/hr/staff-directory/staff-form';
import { OrganizationalChart } from '@/components/hr/staff-directory/organizational-chart';
import { mockStaffData } from '@/data/mock-staff-directory';
import type { StaffMember } from '@/types/staff-directory';

export default function StaffDirectoryPage() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaffData);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateStaff = (newStaff: StaffMember) => {
    // Generate a new ID for the staff member
    const newId = `ST${staff.length + 1001}`;
    const staffWithId = { ...newStaff, id: newId };
    setStaff([...staff, staffWithId]);
  };

  const handleUpdateStaff = (updatedStaff: StaffMember) => {
    setStaff(staff.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
    setSelectedStaff(null);
    setIsEditing(false);
  };

  const handleEditStaff = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setIsEditing(true);
  };

  const handleDeleteStaff = (staffId: string) => {
    // First, update any staff members who report to this manager
    const updatedStaff = staff.map((s) => (s.managerId === staffId ? { ...s, managerId: null } : s));

    // Then remove the staff member
    setStaff(updatedStaff.filter((s) => s.id !== staffId));
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
        <p className="text-muted-foreground mt-2">Manage staff profiles and organizational structure</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list">Staff List</TabsTrigger>
          <TabsTrigger value="org-chart">Organizational Chart</TabsTrigger>
          <TabsTrigger value="add-staff">Add New Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Staff Directory</CardTitle>
              <CardDescription>View and manage all staff profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <StaffTable staff={staff} onEdit={handleEditStaff} onDelete={handleDeleteStaff} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="org-chart">
          <Card>
            <CardHeader>
              <CardTitle>Organizational Chart</CardTitle>
              <CardDescription>Visualize the company's reporting structure</CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationalChart staff={staff} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-staff">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Staff Profile' : 'Add New Staff Member'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Update staff member information' : 'Create a new staff profile in the directory'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StaffForm
                staff={selectedStaff}
                allStaff={staff}
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

