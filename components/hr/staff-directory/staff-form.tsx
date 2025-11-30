'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StaffMember } from '@/types/staff-directory';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';

// NRIC validation regex for Singapore NRIC
// Format: S/T/F/G/M followed by 7 digits and a letter
const nricRegex = /^[STFGM]\d{7}[A-Z]$/;

// Form validation schema
const staffFormSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  nric: z.string().regex(nricRegex, {
    message: 'Invalid NRIC format. Should be like S1234567A.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  position: z.string().min(2, {
    message: 'Position must be at least 2 characters.',
  }),
  department: z.string().min(1, {
    message: 'Please select a department.',
  }),
  managerId: z.string().nullable(),
  phone: z.string().optional(),
});

type StaffFormValues = z.infer<typeof staffFormSchema>

interface StaffFormProps {
  staff: StaffMember | null
  allStaff: StaffMember[]
  onSubmit: (data: StaffMember) => void
  onCancel: () => void
}

export function StaffForm({ staff, allStaff, onSubmit, onCancel }: StaffFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(staff?.photoUrl || null);

  // Initialize form with default values or existing staff data
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      fullName: '',
      nric: '',
      email: '',
      position: '',
      department: '',
      managerId: null,
      phone: '',
    },
  });

  // Update form values when editing existing staff
  useEffect(() => {
    if (staff) {
      form.reset({
        fullName: staff.fullName,
        nric: staff.nric || '',
        email: staff.email,
        position: staff.position,
        department: staff.department,
        managerId: staff.managerId,
        phone: staff.phone || '',
      });
      setPhotoPreview(staff.photoUrl || null);
    }
  }, [staff, form]);

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove photo
  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // Get potential managers (exclude self and anyone who reports to this person)
  const getPotentialManagers = () => {
    if (!staff) return allStaff;

    // Find all staff who report to this person (directly or indirectly)
    const findReports = (managerId: string): string[] => {
      const directReports = allStaff.filter((s) => s.managerId === managerId).map((s) => s.id);

      const allReports = [...directReports];

      directReports.forEach((reportId) => {
        allReports.push(...findReports(reportId));
      });

      return allReports;
    };

    const allReports = findReports(staff.id);

    // Filter out self and all reports
    return allStaff.filter((s) => s.id !== staff.id && !allReports.includes(s.id));
  };

  const potentialManagers = getPotentialManagers();

  // Handle form submission
  const handleSubmit = async (values: StaffFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would upload the photo to a storage service
      // and get back a URL. Here we're just using the preview URL.
      const photoUrl = photoPreview;

      const staffData: StaffMember = {
        id: staff?.id || 'temp-id', // In a real app, the backend would generate this
        fullName: values.fullName,
        nric: values.nric,
        email: values.email,
        position: values.position,
        department: values.department,
        managerId: values.managerId,
        phone: values.phone,
        photoUrl: photoUrl,
      };

      onSubmit(staffData);

      if (!staff) {
        form.reset();
        setPhotoFile(null);
        setPhotoPreview(null);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Photo Upload */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={photoPreview || ''} alt="Staff photo" />
              <AvatarFallback className="text-lg">
                {form.watch('fullName')
                  ? form
                      .watch('fullName')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .substring(0, 2)
                  : 'UP'}
              </AvatarFallback>
            </Avatar>
            {photoPreview && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                onClick={handleRemovePhoto}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-2">Staff Photo</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
                  <Upload className="h-4 w-4" />
                  <span>Upload Photo</span>
                </div>
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
              <p className="text-sm text-muted-foreground">Upload a professional photo (JPEG or PNG, max 5MB)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nric"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NRIC Number</FormLabel>
                <FormControl>
                  <Input placeholder="S1234567A" {...field} />
                </FormControl>
                <FormDescription>Singapore NRIC format (e.g., S1234567A)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+65 9123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Position</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="managerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reports To</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">No Manager</SelectItem>
                    {potentialManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.fullName} - {manager.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select who this staff member reports to</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : staff ? 'Update Profile' : 'Create Profile'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

