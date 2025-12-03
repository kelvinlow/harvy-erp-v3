'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEnterNavigation } from '@/hooks/use-enter-navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import type { PurchaseRequisition } from '@/types';
import { CompanySelector } from '@/components/company-selector';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';

interface PurchaseRequisitionItem {
  id: string;
  stockCode: string;
  description: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  discount: number;
  subAmount: number;
  taxCode: string;
  taxRate: number;
  station: string;
  totalAmount: number;
}

interface InventoryItem {
  stockCode: string;
  description: string;
  uomCode: string;
  lastPrice: number;
}

export function PurchaseRequisitionForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const inventoryItems: InventoryItem[] = [
    {
      stockCode: 'A123',
      description: 'Widget A',
      uomCode: 'EA',
      lastPrice: 10.0
    },
    {
      stockCode: 'B456',
      description: 'Gadget B',
      uomCode: 'EA',
      lastPrice: 25.5
    },
    {
      stockCode: 'C789',
      description: 'Thingamajig C',
      uomCode: 'EA',
      lastPrice: 5.75
    }
  ];

  // Initialize the Enter key navigation
  useEnterNavigation(formRef as React.RefObject<HTMLFormElement>);

  const form = useForm<PurchaseRequisition>({
    defaultValues: {
      company: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      items: [
        {
          id: '1',
          stockCode: '',
          description: '',
          quantity: 0,
          uom: '',
          unitPrice: 0,
          discount: 0,
          subAmount: 0,
          taxCode: '',
          taxRate: 0,
          station: '',
          totalAmount: 0
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  async function onSubmit(data: PurchaseRequisition) {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(data);
      toast({
        title: 'Success',
        description: 'Purchase requisition has been submitted.'
      });
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit purchase requisition.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Requisition Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Company</FormLabel>
                  <FormControl>
                    <CompanySelector
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(format(date!, 'yyyy-MM-dd'))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee No</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference No</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department/Station Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department/Station</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-card p-6">
              <div className="grid gap-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-[2fr,3fr,1fr,1fr,1fr,auto] items-end gap-4"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.stockCode`}
                      render={({ field: itemField }) => (
                        <FormItem className="flex flex-col">
                          {index === 0 && <FormLabel>Stock Code</FormLabel>}
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    'w-full justify-between',
                                    !field.stockCode && 'text-muted-foreground'
                                  )}
                                >
                                  {field.stockCode || 'Select stock'}
                                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <Command>
                                <CommandInput placeholder="Search stock..." />
                                <CommandList>
                                  <CommandEmpty>No stock found.</CommandEmpty>
                                  <CommandGroup>
                                    {inventoryItems.map((item) => (
                                      <CommandItem
                                        key={item.stockCode}
                                        value={item.stockCode}
                                        onSelect={() => {
                                          itemField.onChange(item.stockCode);
                                          form.setValue(
                                            `items.${index}.description`,
                                            item.description
                                          );
                                          form.setValue(
                                            `items.${index}.uom`,
                                            item.uomCode
                                          );
                                          form.setValue(
                                            `items.${index}.unitPrice`,
                                            item.lastPrice
                                          );
                                        }}
                                      >
                                        {item.stockCode} - {item.description}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel>Description</FormLabel>}
                          <FormControl>
                            <Input {...field} readOnly className="bg-muted" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel>Quantity</FormLabel>}
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                                const quantity = Number(e.target.value);
                                const unitPrice = form.getValues(
                                  `items.${index}.unitPrice`
                                );
                                const subAmount = quantity * unitPrice;
                                form.setValue(
                                  `items.${index}.subAmount`,
                                  subAmount
                                );
                                form.setValue(
                                  `items.${index}.totalAmount`,
                                  subAmount
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.uom`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel>UOM</FormLabel>}
                          <FormControl>
                            <Input {...field} readOnly className="bg-muted" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel>Unit Price</FormLabel>}
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                                const unitPrice = Number(e.target.value);
                                const quantity = form.getValues(
                                  `items.${index}.quantity`
                                );
                                const subAmount = quantity * unitPrice;
                                form.setValue(
                                  `items.${index}.subAmount`,
                                  subAmount
                                );
                                form.setValue(
                                  `items.${index}.totalAmount`,
                                  subAmount
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-10 w-10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-6"
                onClick={() =>
                  append({
                    id: String(fields.length + 1),
                    stockCode: '',
                    description: '',
                    quantity: 0,
                    uom: '',
                    unitPrice: 0,
                    discount: 0,
                    subAmount: 0,
                    taxCode: '',
                    taxRate: 0,
                    station: '',
                    totalAmount: 0
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm">
              Total: MYR{' '}
              {fields
                .reduce((sum, item) => sum + item.totalAmount, 0)
                .toFixed(2)}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
