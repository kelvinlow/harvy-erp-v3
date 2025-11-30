'use client';

import { useState } from 'react';
import { Search, X, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { GatepassFilterOptions, GatepassStatus, GatepassType } from '@/types/gatepass';
import { cn } from '@/lib/utils';

interface GatepassFiltersProps {
  filterOptions: GatepassFilterOptions
  onFilterChange: (filters: Partial<GatepassFilterOptions>) => void
}

export default function GatepassFilters({ filterOptions, onFilterChange }: GatepassFiltersProps) {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    filterOptions.dateRange.from ? new Date(filterOptions.dateRange.from) : undefined,
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    filterOptions.dateRange.to ? new Date(filterOptions.dateRange.to) : undefined,
  );

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    onFilterChange({
      dateRange: {
        ...filterOptions.dateRange,
        from: date ? date.toISOString() : null,
      },
    });
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    onFilterChange({
      dateRange: {
        ...filterOptions.dateRange,
        to: date ? date.toISOString() : null,
      },
    });
  };

  const handleClearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    onFilterChange({
      search: '',
      status: 'All',
      itemType: 'All',
      dateRange: {
        from: null,
        to: null,
      },
      requestor: '',
    });
  };

  const hasActiveFilters = () => {
    return (
      filterOptions.search !== '' ||
      filterOptions.status !== 'All' ||
      filterOptions.itemType !== 'All' ||
      filterOptions.dateRange.from !== null ||
      filterOptions.dateRange.to !== null ||
      filterOptions.requestor !== ''
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by ID, item, requestor..."
            className="pl-8"
            value={filterOptions.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            value={filterOptions.status}
            onValueChange={(value) => onFilterChange({ status: value as GatepassStatus | 'All' })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Out">Out</SelectItem>
              <SelectItem value="Returned">Returned</SelectItem>
              <SelectItem value="Replaced">Replaced</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterOptions.itemType}
            onValueChange={(value) => onFilterChange({ itemType: value as GatepassType | 'All' })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Item Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Item">Item</SelectItem>
              <SelectItem value="Machinery">Machinery</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
              <SelectItem value="Tool">Tool</SelectItem>
              <SelectItem value="Vehicle">Vehicle</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !fromDate && !toDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate && toDate ? (
                  <>
                    {fromDate.toLocaleDateString()} - {toDate.toLocaleDateString()}
                  </>
                ) : fromDate ? (
                  <>From {fromDate.toLocaleDateString()}</>
                ) : toDate ? (
                  <>Until {toDate.toLocaleDateString()}</>
                ) : (
                  'Select date range'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex flex-col sm:flex-row">
                <div className="border-r p-2">
                  <div className="px-3 py-2 text-sm font-medium">From</div>
                  <Calendar mode="single" selected={fromDate} onSelect={handleFromDateChange} initialFocus />
                </div>
                <div className="p-2">
                  <div className="px-3 py-2 text-sm font-medium">To</div>
                  <Calendar mode="single" selected={toDate} onSelect={handleToDateChange} initialFocus />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters() && (
            <Button variant="ghost" onClick={handleClearFilters} className="gap-1">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

