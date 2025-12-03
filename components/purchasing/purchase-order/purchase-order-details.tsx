'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, Download } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditableTable } from '@/components/editable-table';

interface PurchaseOrderItem {
  no: number;
  itemCode: string;
  requiredBy: string;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
}

interface PurchaseOrderDetails {
  id: string;
  supplier: string;
  date: string;
  company: string;
  orderConfirmationNo: string;
  requiredBy: string;
  items: PurchaseOrderItem[];
}

// Mock data
const purchaseOrder: PurchaseOrderDetails = {
  id: 'PUR-ORD-2024-00005',
  supplier: 'Dale Moorhouse',
  date: '2024-07-22',
  company: 'Nova Gadget House',
  orderConfirmationNo: '',
  requiredBy: '2024-08-01',
  items: [
    {
      no: 1,
      itemCode: '12345-RED-256GB',
      requiredBy: '2024-08-01',
      quantity: 10,
      uom: 'Unit',
      rate: 47000.0,
      amount: 470000.0
    }
  ]
};

const columns = [
  {
    title: 'No',
    accessorKey: 'no',
    header: 'No'
  },
  {
    title: 'Item Code',
    accessorKey: 'itemCode',
    header: 'Item Code'
  },
  {
    title: 'Required By',
    accessorKey: 'requiredBy',
    header: 'Required By'
  },
  {
    title: 'Quantity',
    accessorKey: 'quantity',
    header: 'Quantity'
  },
  {
    title: 'UOM',
    accessorKey: 'uom',
    header: 'UOM'
  },
  {
    title: 'Rate',
    accessorKey: 'rate',
    header: 'Rate'
  },
  {
    title: 'Amount',
    accessorKey: 'amount',
    header: 'Amount'
  }
];

export function PurchaseOrderDetailsView() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(purchaseOrder.date)
  );
  const [requiredBy, setRequiredBy] = React.useState<Date | undefined>(
    new Date(purchaseOrder.requiredBy)
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Purchase Order {purchaseOrder.id}
        </h1>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="border-b rounded-none w-full justify-start h-auto p-0 bg-transparent">
          <TabsTrigger
            value="details"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="address"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Address & Contact
          </TabsTrigger>
          <TabsTrigger
            value="terms"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Terms
          </TabsTrigger>
          <TabsTrigger
            value="more"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            More Info
          </TabsTrigger>
          <TabsTrigger
            value="connections"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Connections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-base">
                Supplier <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supplier"
                value={purchaseOrder.supplier}
                className="bg-muted"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-base">
                Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-muted',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, 'dd-MM-yyyy')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    required={false}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-base">
                Company <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                value={purchaseOrder.company}
                className="bg-muted"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderConfirmation" className="text-base">
                Order Confirmation No
              </Label>
              <Input
                id="orderConfirmation"
                value={purchaseOrder.orderConfirmationNo}
                placeholder="Enter order confirmation number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredBy" className="text-base">
                Required By
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !requiredBy && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {requiredBy ? (
                      format(requiredBy, 'dd-MM-yyyy')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={requiredBy}
                    onSelect={setRequiredBy}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 flex items-end">
              <div className="space-y-2">
                <Checkbox id="taxWithholding" />
                <Label htmlFor="taxWithholding" className="ml-2">
                  Apply Tax Withholding Amount
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                <ChevronDown className="h-4 w-4" />
                Currency and Price List
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value="INR"
                      className="bg-muted"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exchangeRate">Exchange Rate</Label>
                    <Input
                      id="exchangeRate"
                      value="1.000"
                      className="bg-muted"
                      readOnly
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <EditableTable columns={columns} data={purchaseOrder.items} />
          </div>

          <div className="flex justify-between">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <div className="space-x-2">
              <Button variant="outline">Save</Button>
              <Button>Submit</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="address">
          <div className="text-sm text-muted-foreground">
            Address and contact information will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="terms">
          <div className="text-sm text-muted-foreground">
            Terms and conditions will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="more">
          <div className="text-sm text-muted-foreground">
            Additional information will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="connections">
          <div className="text-sm text-muted-foreground">
            Connected documents will be displayed here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
