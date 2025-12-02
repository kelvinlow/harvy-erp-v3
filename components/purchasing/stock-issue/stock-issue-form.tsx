'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StockIssueHeader } from './stock-issue-header';
import { StockIssueTable } from './stock-issue-table';

export function StockIssueForm() {
  const [stockCode, setStockCode] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [uom, setUom] = useState('');
  const [items, setItems] = useState<any[]>([]);

  const handleAddItem = () => {
    if (stockCode && quantity) {
      const newItem = {
        id: Date.now(),
        stockCode,
        description,
        quantity,
        uom,
      };
      setItems([...items, newItem]);
      setStockCode('');
      setDescription('');
      setQuantity('');
      setUom('');
    }
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <StockIssueHeader />

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="stockCode">Stock Code</Label>
              <Input
                id="stockCode"
                value={stockCode}
                onChange={(e) => setStockCode(e.target.value)}
                placeholder="Enter stock code"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label htmlFor="uom">UOM</Label>
              <Select value={uom} onValueChange={setUom}>
                <SelectTrigger id="uom">
                  <SelectValue placeholder="Select UOM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">PCS</SelectItem>
                  <SelectItem value="kg">KG</SelectItem>
                  <SelectItem value="ltr">LTR</SelectItem>
                  <SelectItem value="box">BOX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddItem}>Add Item</Button>

          <div className="mt-6">
            <StockIssueTable items={items} onRemove={handleRemoveItem} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="issueTo">Issue To</Label>
              <Select>
                <SelectTrigger id="issueTo">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="quality">Quality Control</SelectItem>
                  <SelectItem value="rd">R&D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input id="issueDate" type="date" />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="reason">Reason for Issue</Label>
            <Textarea id="reason" placeholder="Enter reason for stock issue" />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button>Submit Issue</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

