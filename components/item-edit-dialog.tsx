'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ItemEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rowNumber: number
  data: {
    itemCode: string
    itemName: string
    requiredBy: string
    quantity: number
    uom: string
    stockUom: string
    uomConversionFactor: number
    targetWarehouse: string
    stockQty: number
  }
  onSave: (data: any) => void
}

export function ItemEditDialog({ open, onOpenChange, rowNumber, data, onSave }: ItemEditDialogProps) {
  const [formData, setFormData] = React.useState(data);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editing Row #{rowNumber}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Item Code <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-red-500" />
                <Input value={formData.itemCode} onChange={(e) => handleChange('itemCode', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Required By <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.requiredBy}
                onChange={(e) => handleChange('requiredBy', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Item Name</Label>
            <Input
              value={formData.itemName}
              onChange={(e) => handleChange('itemName', e.target.value)}
              className="bg-muted"
              readOnly
            />
          </div>

          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
              Description
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <textarea className="w-full rounded-md border bg-muted px-3 py-2" rows={4} readOnly />
            </CollapsibleContent>
          </Collapsible>

          <div className="space-y-4">
            <h3 className="font-medium">Quantity and Warehouse</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', Number.parseFloat(e.target.value))}
                  step="0.001"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  UOM <span className="text-red-500">*</span>
                </Label>
                <Input value={formData.uom} onChange={(e) => handleChange('uom', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>
                  Stock UOM <span className="text-red-500">*</span>
                </Label>
                <Input value={formData.stockUom} onChange={(e) => handleChange('stockUom', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>
                  UOM Conversion Factor <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.uomConversionFactor}
                  onChange={(e) => handleChange('uomConversionFactor', Number.parseFloat(e.target.value))}
                  step="0.001"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Warehouse</Label>
                <Select
                  value={formData.targetWarehouse}
                  onValueChange={(value) => handleChange('targetWarehouse', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stores-gh">Stores - GH</SelectItem>
                    <SelectItem value="bengaluru-gh">Bengaluru - GH</SelectItem>
                    <SelectItem value="chennai-gh">Chennai - GH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stock Qty</Label>
                <Input type="number" value={formData.stockQty} className="bg-muted" readOnly />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

