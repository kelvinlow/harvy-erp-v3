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
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import type { PurchaseRequisition } from '@/types';
import { CompanySelector } from '@/components/company-selector';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';

interface InventoryItem {
  stockCode: string;
  description: string;
  uomCode: string;
  lastPrice: number;
}

export function PurchaseRequisitionForm() {
  const { toast } = useToast();
  const user = useUser();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [inventoryItems, setInventoryItems] = React.useState<InventoryItem[]>(
    []
  );
  const [isInventoryLoading, setIsInventoryLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchInventory() {
      try {
        setIsInventoryLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api/v1'
          }/stock-items`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch inventory');
        }

        const result = await response.json();
        // Map database fields to inventory item interface
        const items = (result.data || []).map(
          (item: {
            stockCode: string;
            description: string;
            uom: string;
            unitPrice: number;
          }) => ({
            stockCode: item.stockCode,
            description: item.description,
            uomCode: item.uom,
            lastPrice: item.unitPrice
          })
        );
        setInventoryItems(items);
      } catch (err) {
        console.error('Error loading inventory:', err);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load inventory items'
        });
      } finally {
        setIsInventoryLoading(false);
      }
    }

    fetchInventory();
  }, [toast]);

  // Initialize the Enter key navigation
  useEnterNavigation(formRef as React.RefObject<HTMLFormElement>);

  const form = useForm<PurchaseRequisition>({
    defaultValues: {
      company: '',
      department: '',
      departmentCode: '',
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
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to submit a requisition.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api/v1'
        }/purchase-requisitions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            company: data.company,
            department: data.department,
            departmentCode: data.departmentCode,
            employeeNo: data.employeeNo,
            employeeName: data.employeeName,
            referenceNo: data.referenceNo,
            notes: data.remarks,
            requestedById: user.id,
            urgency: 'Medium',
            items: data.items.map((item) => ({
              stockCode: item.stockCode,
              description: item.description,
              quantity: item.quantity,
              uom: item.uom,
              unitPrice: item.unitPrice,
              totalPrice: item.totalAmount,
              discount: item.discount || 0,
              taxCode: item.taxCode,
              taxRate: item.taxRate || 0,
              station: item.station
            }))
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit purchase requisition');
      }

      toast({
        title: 'Success',
        description: 'Purchase requisition has been submitted.'
      });
      form.reset();
    } catch (error) {
      console.error('Submit error:', error);
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
                name="departmentCode"
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
                name="department"
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
            <div className="rounded-xl border bg-card/30 shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[180px] font-bold">
                        Stock Code
                      </TableHead>
                      <TableHead className="min-w-[250px] font-bold">
                        Description
                      </TableHead>
                      <TableHead className="w-[100px] text-right font-bold">
                        Quantity
                      </TableHead>
                      <TableHead className="w-[80px] text-center font-bold">
                        UOM
                      </TableHead>
                      <TableHead className="w-[130px] text-right font-bold">
                        Unit Price
                      </TableHead>
                      <TableHead className="w-[130px] text-right font-bold">
                        Amount
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center text-muted-foreground italic"
                        >
                          No items added yet. Click &quot;Add New Line&quot; to
                          start.
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((field, index) => (
                        <TableRow
                          key={field.id}
                          className="group transition-colors"
                        >
                          <TableCell className="align-top">
                            <FormField
                              control={form.control}
                              name={`items.${index}.stockCode`}
                              render={({ field: itemField }) => (
                                <FormItem>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          className={cn(
                                            'w-full justify-between font-normal hover:border-primary/50 transition-all truncate',
                                            !field.stockCode &&
                                              'text-muted-foreground'
                                          )}
                                        >
                                          {field.stockCode || 'Select stock...'}
                                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-[350px] p-0"
                                      align="start"
                                    >
                                      <Command>
                                        <CommandInput placeholder="Search stock or description..." />
                                        <CommandList>
                                          <CommandEmpty>
                                            No stock found.
                                          </CommandEmpty>
                                          <CommandGroup heading="Inventory Items">
                                            {isInventoryLoading ? (
                                              <div className="flex items-center justify-center p-8">
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                <span className="ml-2 text-sm font-medium">
                                                  Loading inventory...
                                                </span>
                                              </div>
                                            ) : (
                                              inventoryItems.map((item) => (
                                                <CommandItem
                                                  key={item.stockCode}
                                                  value={`${item.stockCode} ${item.description}`}
                                                  onSelect={() => {
                                                    itemField.onChange(
                                                      item.stockCode
                                                    );
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
                                                      item.lastPrice || 0
                                                    );
                                                    const qty =
                                                      form.getValues(
                                                        `items.${index}.quantity`
                                                      ) || 0;
                                                    form.setValue(
                                                      `items.${index}.totalAmount`,
                                                      qty *
                                                        (item.lastPrice || 0)
                                                    );
                                                  }}
                                                  className="flex flex-col items-start py-3"
                                                >
                                                  <div className="font-bold">
                                                    {item.stockCode}
                                                  </div>
                                                  <div className="text-xs text-muted-foreground line-clamp-1">
                                                    {item.description}
                                                  </div>
                                                  <div className="mt-1 flex gap-2 text-[10px] font-bold text-primary italic uppercase">
                                                    <span>{item.uomCode}</span>
                                                    <span>•</span>
                                                    <span>
                                                      Price:{' '}
                                                      {item.lastPrice?.toFixed(
                                                        2
                                                      )}
                                                    </span>
                                                  </div>
                                                </CommandItem>
                                              ))
                                            )}
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>

                          <TableCell className="align-top">
                            <FormField
                              control={form.control}
                              name={`items.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      readOnly
                                      className="bg-muted/30 border-dashed border-muted-foreground/30 cursor-default focus-visible:ring-0"
                                      placeholder="Auto-filled"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>

                          <TableCell className="align-top">
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      className="text-right focus:border-primary/50 transition-all font-medium"
                                      onChange={(e) => {
                                        const qty =
                                          e.target.value === ''
                                            ? 0
                                            : Number(e.target.value);
                                        field.onChange(qty);
                                        const price =
                                          form.getValues(
                                            `items.${index}.unitPrice`
                                          ) || 0;
                                        form.setValue(
                                          `items.${index}.totalAmount`,
                                          qty * price
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>

                          <TableCell className="align-top">
                            <FormField
                              control={form.control}
                              name={`items.${index}.uom`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      readOnly
                                      className="text-center bg-muted/30 border-dashed border-muted-foreground/30 cursor-default focus-visible:ring-0"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>

                          <TableCell className="align-top">
                            <FormField
                              control={form.control}
                              name={`items.${index}.unitPrice`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      className="text-right focus:border-primary/50 transition-all"
                                      onChange={(e) => {
                                        const price =
                                          e.target.value === ''
                                            ? 0
                                            : Number(e.target.value);
                                        field.onChange(price);
                                        const qty =
                                          form.getValues(
                                            `items.${index}.quantity`
                                          ) || 0;
                                        form.setValue(
                                          `items.${index}.totalAmount`,
                                          qty * price
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>

                          <TableCell className="align-top text-right">
                            <div className="h-10 flex items-center justify-end px-3 font-mono font-bold text-primary">
                              {form
                                .watch(`items.${index}.totalAmount`)
                                ?.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                }) || '0.00'}
                            </div>
                          </TableCell>

                          <TableCell className="align-top">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="h-10 w-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove item</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="p-4 bg-muted/20 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-12 border-dashed hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all font-semibold"
                  onClick={() =>
                    append({
                      id: crypto.randomUUID(),
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
                  Add New Line Item
                </Button>
              </div>
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
          <CardFooter className="flex flex-col items-end gap-4 border-t p-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total Amount:
              </span>
              <span className="text-2xl font-bold tracking-tight text-primary">
                MYR{' '}
                {fields
                  .reduce((sum, item) => sum + (item.totalAmount || 0), 0)
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
              </span>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Requisition'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
