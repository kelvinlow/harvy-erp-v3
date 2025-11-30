'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { ServiceRecord } from '@/types/machine';

interface ServiceRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record?: ServiceRecord | null
  onSubmit: (data: Partial<ServiceRecord>) => Promise<void>
}

export function ServiceRecordDialog({ open, onOpenChange, record, onSubmit }: ServiceRecordDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: {
      serviceDate: record?.serviceDate || format(new Date(), 'yyyy-MM-dd'),
      description: record?.description || '',
      performedBy: record?.performedBy || '',
      cost: record?.cost?.toString() || '0',
      notes: record?.notes || '',
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        serviceDate: record?.serviceDate || format(new Date(), 'yyyy-MM-dd'),
        description: record?.description || '',
        performedBy: record?.performedBy || '',
        cost: record?.cost?.toString() || '0',
        notes: record?.notes || '',
      });
    }
  }, [open, record, form]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        cost: Number.parseFloat(data.cost),
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{record ? 'Edit Service Record' : 'Add Service Record'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => field.onChange(format(date!, 'yyyy-MM-dd'))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                    <Input {...field} placeholder="Enter service description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="performedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Performed By</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter technician or company name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" min="0" placeholder="0.00" />
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
                    <Textarea {...field} placeholder="Additional notes (optional)" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {record ? 'Update' : 'Add'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

