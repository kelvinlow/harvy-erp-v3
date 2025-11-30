'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Download, Filter } from 'lucide-react';
import StockBalanceTable from './stock-balance-table';
import StockBalanceChart from './stock-balance-chart';
import { mockStockBalanceData } from '@/data/mock-stock-balance';
import { mockItemGroups } from '@/data/mock-item-groups';

export default function StockBalanceView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [viewType, setViewType] = useState('table');

  // Filter stock data based on search term and filters
  const filteredStockData = mockStockBalanceData.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup =
      selectedGroup === 'all' || item.itemGroup === selectedGroup;
    const matchesLocation =
      selectedLocation === 'all' || item.location === selectedLocation;

    return matchesSearch && matchesGroup && matchesLocation;
  });

  // Get unique locations for filter
  const locations = Array.from(
    new Set(mockStockBalanceData.map((item) => item.location))
  );

  return (
    <div className="flex flex-col md:gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Item Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {mockItemGroups.map((group) => (
                    <SelectItem key={group.id} value={group.name}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div> */}
        </CardContent>
      </Card>
      <Tabs value={viewType} onValueChange={setViewType} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="chart">Chart View</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <StockBalanceTable stockData={filteredStockData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chart" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <StockBalanceChart stockData={filteredStockData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
