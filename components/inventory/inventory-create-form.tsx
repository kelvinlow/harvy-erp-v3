'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  stockCode: z.string().min(1, 'Please select a stock item.'),
  description: z.string(),
  uom: z.string().min(1, 'Please select a unit of measure.'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  remarks: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface StockItem {
  id: number;
  stockCode: string;
  description: string;
  uom: string;
  currentStock: number;
  unitPrice: number;
}

interface UOMItem {
  id: number;
  code: string;
  description: string;
}

export function InventoryCreateForm() {
  const { toast } = useToast();
  const [stockItems, setStockItems] = React.useState<StockItem[]>([]);
  const [uoms, setUoms] = React.useState<UOMItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [openCombobox, setOpenCombobox] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stockCode: '',
      description: '',
      uom: '',
      quantity: 0,
      remarks: ''
    }
  });

  // Fetch Stock Items
  React.useEffect(() => {
    async function fetchItems() {
      setIsLoadingItems(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'https://havys-erp-worker-production.lowshinsheng.workers.dev/api/v1/stock-items',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        if (data.data) {
          setStockItems(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stock items:', error);
      } finally {
        setIsLoadingItems(false);
      }
    }
    fetchItems();
  }, []);

  // Fetch UOMs
  React.useEffect(() => {
    async function fetchUoms() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'https://havys-erp-worker-production.lowshinsheng.workers.dev/api/v1/uom',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        if (data.data) {
          setUoms(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch UOMs:', error);
      }
    }
    fetchUoms();
  }, []);

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'https://havys-erp-worker-production.lowshinsheng.workers.dev/api/v1/stock-movements/in',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            stockCode: data.stockCode,
            quantity: data.quantity,
            uom: data.uom,
            remarks: data.remarks
          })
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to update stock');
      }

      toast({
        title: 'Success',
        description: 'Stock updated successfully.'
      });

      // Reset form but keep UOM list and Items list
      form.reset({
        stockCode: '',
        description: '',
        uom: '',
        quantity: 0,
        remarks: ''
      });
    } catch (error) {
      console.error('Submit error', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save inventory.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add Stock</CardTitle>
          <CardDescription>
            Record new stock arrival or adjustment. Select an existing stock
            item to add quantity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Stock Code Selection */}
                <FormField
                  control={form.control}
                  name="stockCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Stock Code</FormLabel>
                      <Popover
                        open={openCombobox}
                        onOpenChange={setOpenCombobox}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCombobox}
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                              disabled={isLoadingItems}
                            >
                              {field.value
                                ? stockItems.find(
                                    (item) => item.stockCode === field.value
                                  )?.stockCode
                                : isLoadingItems
                                ? 'Loading items...'
                                : 'Select stock code'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Search stock code..." />
                            <CommandList>
                              <CommandEmpty>No item found.</CommandEmpty>
                              <CommandGroup>
                                {stockItems.map((item) => (
                                  <CommandItem
                                    key={item.stockCode}
                                    value={item.stockCode}
                                    onSelect={(currentValue) => {
                                      form.setValue('stockCode', currentValue);
                                      // Auto-populate description and UOM
                                      form.setValue(
                                        'description',
                                        item.description || ''
                                      );
                                      form.setValue('uom', item.uom || '');
                                      setOpenCombobox(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value === item.stockCode
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
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

                {/* UOM Selection */}
                <FormField
                  control={form.control}
                  name="uom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit (UOM)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uoms.map((uom) => (
                            <SelectItem key={uom.id} value={uom.code}>
                              {uom.code} - {uom.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description - Read Only for visual confirmation */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description / Item Name</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional notes about this stock addition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Stock
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
