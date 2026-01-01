'use client';

import { useState, useEffect } from 'react';
import { Clock, Download, Search, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { PriceHistoryDialog } from '@/components/price-history-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockItemGroups } from '@/data/mock-item-groups';

interface InventoryItem {
  stockCode: string;
  description: string;
  uom: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
  priceHistory: {
    date: string;
    documentNo: string;
    supplier: string;
    price: number;
  }[];
}

// Sample data
export function InventoryList() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [priceHistoryOpen, setPriceHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupFilter, setGroupFilter] = useState('all');

  // Fetch inventory items
  useEffect(() => {
    async function fetchItems() {
      try {
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
        const data = await response.json();

        if (data.data) {
          const mappedItems = data.data.map((item: any) => ({
            stockCode: item.stockCode,
            description: item.description,
            uom: item.uom,
            quantity: item.currentStock,
            unitCost: item.unitPrice,
            totalValue: item.currentStock * item.unitPrice,
            priceHistory: [] // Initial empty history
          }));
          setItems(mappedItems);
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, []);

  // Fetch price history for an item
  const handlePriceHistoryClick = async (item: InventoryItem) => {
    setSelectedItem(item);
    setPriceHistoryOpen(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api/v1'
        }/stock-items/${item.stockCode}/price-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();

      if (data.data) {
        setSelectedItem((prev) =>
          prev
            ? {
                ...prev,
                priceHistory: data.data
              }
            : null
        );
      }
    } catch (error) {
      console.error('Failed to fetch price history:', error);
    }
  };

  // Get item codes that belong to the selected group
  const getItemCodesInGroup = (groupId: string) => {
    if (groupId === 'all') return null;

    const group = mockItemGroups.find((g) => g.id === groupId);
    if (!group) return null;

    return group.items.map((item) => item.code);
  };

  const itemCodesInSelectedGroup = getItemCodesInGroup(groupFilter);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.stockCode.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesGroup =
      groupFilter === 'all' ||
      (itemCodesInSelectedGroup &&
        itemCodesInSelectedGroup.includes(item.stockCode));

    return matchesSearch && matchesGroup;
  });

  // Get groups that contain this item
  const getGroupsForItem = (itemCode: string) => {
    return mockItemGroups.filter((group) =>
      group.items.some((item) => item.code === itemCode)
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          Loading inventory...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory</CardTitle>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
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
                <TableHead className="text-gray-600 font-medium">
                  Stock Code
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Description
                </TableHead>
                <TableHead className="text-gray-600 font-medium">UOM</TableHead>
                <TableHead className="text-gray-600 font-medium text-right">
                  Quantity
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-right">
                  Unit Cost (RM)
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-right">
                  Total Value (RM)
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Groups
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-right">
                  Actions
                </TableHead>
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
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.unitCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.totalValue.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {itemGroups.length > 0 ? (
                          itemGroups.map((group) => (
                            <Badge
                              key={group.id}
                              variant="outline"
                              className="bg-blue-50"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {group.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            None
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        onClick={() => handlePriceHistoryClick(item)}
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
      </CardContent>
    </Card>
  );
}
