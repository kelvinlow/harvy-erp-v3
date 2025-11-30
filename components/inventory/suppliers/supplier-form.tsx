'use client';

import type React from 'react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Upload, X } from 'lucide-react';
import type { Supplier } from '@/types/supplier';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Supplier name must be at least 2 characters.',
  }),
  contactPerson: z.string().optional(),
  email: z
    .string()
    .email({
      message: 'Please enter a valid email address.',
    })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .url({
      message: 'Please enter a valid URL.',
    })
    .optional()
    .or(z.literal('')),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type FormValues = z.infer<typeof formSchema>

interface SupplierFormProps {
  supplier: Supplier | null
  onSubmit: (data: Supplier) => void
  onCancel: () => void
}

export function SupplierForm({ supplier, onSubmit, onCancel }: SupplierFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(supplier?.logoUrl || null);

  // Initialize form with default values or existing supplier data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: supplier?.name || '',
      contactPerson: supplier?.contactPerson || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
      website: supplier?.website || '',
      notes: supplier?.notes || '',
      status: supplier?.status || 'active',
    },
  });

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      id: supplier?.id || '',
      name: values.name,
      contactPerson: values.contactPerson,
      email: values.email,
      phone: values.phone,
      address: values.address,
      website: values.website,
      notes: values.notes,
      status: values.status,
      logoUrl: logoPreview,
      products: supplier?.products || [],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Logo Upload */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={logoPreview || ''} alt="Supplier logo" />
              <AvatarFallback className="text-lg">
                {form.watch('name') ? getInitials(form.watch('name')) : 'S'}
              </AvatarFallback>
            </Avatar>
            {logoPreview && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                onClick={handleRemoveLogo}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-2">Company Logo</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="logo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
                  <Upload className="h-4 w-4" />
                  <span>Upload Logo</span>
                </div>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </label>
              <p className="text-sm text-muted-foreground">Upload a company logo (JPEG or PNG, max 5MB)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter supplier name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact person name" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" type="email" {...field} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    {field.value === 'active' ? 'Supplier is currently active' : 'Supplier is currently inactive'}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === 'active'}
                    onCheckedChange={(checked) => {
                      field.onChange(checked ? 'active' : 'inactive');
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter supplier address" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter additional notes about this supplier"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{supplier?.id ? 'Update Supplier' : 'Create Supplier'}</Button>
        </div>
      </form>
    </Form>
  );
}

