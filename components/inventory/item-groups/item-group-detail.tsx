'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Edit, Plus, Trash2 } from 'lucide-react';
import type { ItemGroup } from '@/types/item-group';
import type { Stock } from '@/types/stock';

interface ItemGroupDetailProps {
  group: ItemGroup
  availableItems: Stock[]
  onAddItem: (itemId: string) => void
  onRemoveItem: (itemId: string) => void
  onEdit: () => void
}

export function ItemGroupDetail({ group, availableItems, onAddItem, onRemoveItem, onEdit }: ItemGroupDetailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');

  // Filter items in the group based on search term
  const filteredItems = group.items.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get items that are not already in the group
  const itemsNotInGroup = availableItems.filter((item) => !group.items.some((groupItem) => groupItem.id === item.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{group.name}</h2>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
        <Button variant="outline" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Group Details
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Items to Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an item to add" />
                </SelectTrigger>
                <SelectContent>
                  {itemsNotInGroup.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No available items to add
                    </SelectItem>
                  ) : (
                    itemsNotInGroup.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.code} - {item.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => {
                if (selectedItemId) {
                  onAddItem(selectedItemId);
                  setSelectedItemId('');
                }
              }}
              disabled={!selectedItemId || selectedItemId === 'none'}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Items in this Group</h3>
          <div className="relative w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    {group.items.length === 0
                      ? 'No items in this group. Add items using the form above.'
                      : 'No items match your search.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
      </div>
    </div>
  );
}

