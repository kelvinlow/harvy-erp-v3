'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Download, Printer, Search } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { StockLedgerCard } from './stock-ledger-card';
import type { StockItem } from '@/types/stock-ledger';

// Sample data
const stockItems: StockItem[] = [
  {
    code: 'AW0011',
    description: 'LIFT CYLINDER PUMP SEAL KIT',
    openingBalance: {
      quantity: 0,
      amount: 0
    },
    transactions: [
      {
        no: 1,
        transactionNo: 'DL2412203',
        date: new Date(2024, 11, 14),
        quantityIn: 2,
        quantityOut: 0,
        amountIn: 430,
        amountOut: 0
      }
    ]
  },
  {
    code: 'AW0076',
    description: 'SWING ARM',
    openingBalance: {
      quantity: 2,
      amount: 164.59
    },
    transactions: [
      {
        no: 1,
        transactionNo: 'DL2412224',
        date: new Date(2024, 11, 18),
        quantityIn: 1,
        quantityOut: 0,
        amountIn: 75,
        amountOut: 0
      }
    ]
  },
  {
    code: 'AW0145',
    description: 'SEAT COVER',
    openingBalance: {
      quantity: 13,
      amount: 139.37
    },
    transactions: [
      {
        no: 1,
        transactionNo: 'DL2412224',
        date: new Date(2024, 11, 18),
        quantityIn: 1,
        quantityOut: 0,
        amountIn: 9,
        amountOut: 0
      }
    ]
  }
];

export function StockLedgerView() {
  const [date, setDate] = React.useState<Date>(new Date());
  const [search, setSearch] = React.useState('');
  const componentRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef
  });

  const filteredItems = stockItems.filter(
    (item) =>
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col">
      {/* Header Section */}
      {/* <div className="border-b bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Stock Ledger</h1>
          <p className="text-sm text-muted-foreground">View and manage your stock ledger entries</p>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        {/* Controls Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'MMMM yyyy') : 'Select month'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stock code or description..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="w-[100px]"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="w-[100px]">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stock Ledger Cards Grid */}
        <div ref={componentRef}>
          {/* Print Header */}
          <div className="hidden space-y-1 print:mb-6 print:block print:text-center">
            <h1 className="text-xl font-bold">HAVYS OIL MILL SDN. BHD.</h1>
            <p className="text-sm">
              O PARAMOUNT ESTATE, KM 31 JALAN BAHAU-KERATONG,
            </p>
            <p className="text-sm">
              KARUNG BERKUNCI NO.4, POS MALAYSIA, BAHAU, 72100 NEGERI SEMBILAN
            </p>
            <p className="text-sm">TEL: 012-6367717 FAX: 06-4665357</p>
            <h2 className="mt-4 text-lg font-semibold">
              STOCK LEDGER CARD FOR THE MONTH OF{' '}
              {format(date, 'MMMM yyyy').toUpperCase()}
            </h2>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {filteredItems.map((item) => (
              <StockLedgerCard key={item.code} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
