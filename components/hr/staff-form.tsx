'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Staff } from '@/types/staff';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// Form validation schema
const staffFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
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
  phone: z.string().optional(),
  employeeId: z.string().optional(),
  notes: z.string().optional(),
  sendWelcomeEmail: z.boolean().default(true),
});

type StaffFormValues = z.infer<typeof staffFormSchema>

interface StaffFormProps {
  staff: Staff | null
  onSubmit: (data: Staff) => void
  onCancel: () => void
}

export function StaffForm({ staff, onSubmit, onCancel }: StaffFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values or existing staff data
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: '',
      email: '',
      position: '',
      department: '',
      phone: '',
      employeeId: '',
      notes: '',
      sendWelcomeEmail: true,
    },
  });

  // Update form values when editing existing staff
  useEffect(() => {
    if (staff) {
      form.reset({
        name: staff.name,
        email: staff.email,
        position: staff.position,
        department: staff.department,
        phone: staff.phone || '',
        employeeId: staff.employeeId || '',
        notes: staff.notes || '',
        sendWelcomeEmail: false,
      });
    }
  }, [staff, form]);

  // Handle form submission
  const handleSubmit = async (values: StaffFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would make an API call here
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const staffData: Staff = {
        id: staff?.id || 'temp-id', // In a real app, the backend would generate this
        name: values.name,
        email: values.email,
        position: values.position,
        department: values.department,
        status: staff?.status || 'active',
        phone: values.phone,
        employeeId: values.employeeId,
        notes: values.notes,
        lastLogin: staff?.lastLogin || null,
      };

      onSubmit(staffData);

      if (!staff) {
        form.reset(); // Clear form after creating new staff
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" type="email" {...field} />
                </FormControl>
                <FormDescription>This will be used for login and communications</FormDescription>
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
                  </SelectContent>
                </Select>
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
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input placeholder="EMP-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional information about this staff member"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!staff && (
          <FormField
            control={form.control}
            name="sendWelcomeEmail"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Send welcome email</FormLabel>
                  <FormDescription>Send an email with login instructions to the new staff member</FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : staff ? 'Update Staff' : 'Create Staff'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

