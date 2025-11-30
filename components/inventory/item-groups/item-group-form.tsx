'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ItemGroup } from '@/types/item-group';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Group name must be at least 2 characters.',
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>

interface ItemGroupFormProps {
  group: ItemGroup | null
  onSubmit: (data: ItemGroup) => void
  onCancel: () => void
}

export function ItemGroupForm({ group, onSubmit, onCancel }: ItemGroupFormProps) {
  // Initialize form with default values or existing group data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: group?.name || '',
      description: group?.description || '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      id: group?.id || '',
      name: values.name,
      description: values.description || '',
      items: group?.items || [],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter group name" {...field} />
              </FormControl>
              <FormDescription>A clear, descriptive name for this item group</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter a description for this group" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>Optional: Provide additional details about this group</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{group?.id ? 'Update Group' : 'Create Group'}</Button>
        </div>
      </form>
    </Form>
  );
}

