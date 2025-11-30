'use client';

import { useState } from 'react';
import { Clock, Download, Search, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PriceHistoryDialog } from '@/components/price-history-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockItemGroups } from '@/data/mock-item-groups';

interface InventoryItem {
  stockCode: string
  description: string
  uom: string
  quantity: number
  unitCost: number
  totalValue: number
  priceHistory: {
    date: string
    documentNo: string
    supplier: string
    price: number
  }[]
}

// Sample data
const inventoryItems: InventoryItem[] = [
  {
    stockCode: 'EP0001',
    description: 'PVC INSULATION TAPE (ELECTRICAL)',
    uom: 'PCS',
    quantity: 100,
    unitCost: 23.99,
    totalValue: 2399.0,
    priceHistory: [
      {
        date: '2024-01-01',
        documentNo: 'PO-240101',
        supplier: 'Electrical Supplies Co',
        price: 23.99,
      },
      {
        date: '2023-12-01',
        documentNo: 'PO-231201',
        supplier: 'Electrical Supplies Co',
        price: 22.5,
      },
      {
        date: '2023-11-01',
        documentNo: 'PO-231101',
        supplier: 'Best Electronics',
        price: 21.99,
      },
    ],
  },
  {
    stockCode: 'BN0013',
    description: '1"X 5" M/S BOLT & NUT',
    uom: 'PCS',
    quantity: 44,
    unitCost: 5.76,
    totalValue: 253.44,
    priceHistory: [
      {
        date: '2024-01-01',
        documentNo: 'PO-240101',
        supplier: 'Hardware Solutions',
        price: 5.76,
      },
      {
        date: '2023-12-15',
        documentNo: 'PO-231215',
        supplier: 'Hardware Solutions',
        price: 5.5,
      },
    ],
  },
];

export function InventoryList() {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [priceHistoryOpen, setPriceHistoryOpen] = useState(false);
  const [groupFilter, setGroupFilter] = useState('all');

  // Get item codes that belong to the selected group
  const getItemCodesInGroup = (groupId: string) => {
    if (groupId === 'all') return null;

    const group = mockItemGroups.find((g) => g.id === groupId);
    if (!group) return null;

    return group.items.map((item) => item.code);
  };

  const itemCodesInSelectedGroup = getItemCodesInGroup(groupFilter);

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.stockCode.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesGroup =
      groupFilter === 'all' || (itemCodesInSelectedGroup && itemCodesInSelectedGroup.includes(item.stockCode));

    return matchesSearch && matchesGroup;
  });

  // Get groups that contain this item
  const getGroupsForItem = (itemCode: string) => {
    return mockItemGroups.filter((group) => group.items.some((item) => item.code === itemCode));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <Button variant="outline" className="bg-white text-gray-600 border-gray-200 hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search inventory..."
            className="pl-9 h-10 bg-white border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[250px]">
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              {mockItemGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-600 font-medium">Stock Code</TableHead>
              <TableHead className="text-gray-600 font-medium">Description</TableHead>
              <TableHead className="text-gray-600 font-medium">UOM</TableHead>
              <TableHead className="text-gray-600 font-medium text-right">Quantity</TableHead>
              <TableHead className="text-gray-600 font-medium text-right">Unit Cost (RM)</TableHead>
              <TableHead className="text-gray-600 font-medium text-right">Total Value (RM)</TableHead>
              <TableHead className="text-gray-600 font-medium">Groups</TableHead>
              <TableHead className="text-gray-600 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => {
              const itemGroups = getGroupsForItem(item.stockCode);

              return (
                <TableRow key={item.stockCode}>
                  <TableCell>{item.stockCode}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.uom}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.unitCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.totalValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {itemGroups.length > 0 ? (
                        itemGroups.map((group) => (
                          <Badge key={group.id} variant="outline" className="bg-blue-50">
                            <Tag className="h-3 w-3 mr-1" />
                            {group.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      onClick={() => {
                        setSelectedItem(item);
                        setPriceHistoryOpen(true);
                      }}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Price History
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <PriceHistoryDialog
          open={priceHistoryOpen}
          onOpenChange={setPriceHistoryOpen}
          stockCode={selectedItem.stockCode}
          description={selectedItem.description}
          priceHistory={selectedItem.priceHistory}
        />
      )}
    </div>
  );
}

