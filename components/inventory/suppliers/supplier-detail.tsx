'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, Edit, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import type { Supplier, SupplierProduct } from '@/types/supplier';
import type { Stock } from '@/types/stock';

interface SupplierDetailProps {
  supplier: Supplier;
  availableItems: Stock[];
  onAddProduct: (product: SupplierProduct) => void;
  onRemoveProduct: (productId: string) => void;
  onEdit: () => void;
}

export function SupplierDetail({
  supplier,
  availableItems,
  onAddProduct,
  onRemoveProduct,
  onEdit
}: SupplierDetailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<{
    itemId: string;
    price: string;
    minOrderQty: string;
    leadTime: string;
    notes: string;
  }>({
    itemId: '',
    price: '',
    minOrderQty: '',
    leadTime: '',
    notes: ''
  });

  // Filter products based on search term
  const filteredProducts = supplier.products.filter((product) => {
    const item = availableItems.find((item) => item.id === product.itemId);
    if (!item) return false;

    return (
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get item details by id
  const getItemById = (id: string) => {
    return availableItems.find((item) => item.id === id);
  };

  // Handle add product form submission
  const handleAddProduct = () => {
    if (!newProduct.itemId) return;

    const item = getItemById(newProduct.itemId);
    if (!item) return;

    const product: SupplierProduct = {
      itemId: newProduct.itemId,
      price: Number.parseFloat(newProduct.price) || 0,
      minOrderQty: Number.parseInt(newProduct.minOrderQty) || 1,
      leadTime: Number.parseInt(newProduct.leadTime) || 0,
      notes: newProduct.notes,
      lastUpdated: new Date().toISOString()
    };

    onAddProduct(product);
    setIsAddingProduct(false);
    resetNewProduct();
  };

  // Reset new product form
  const resetNewProduct = () => {
    setNewProduct({
      itemId: '',
      price: '',
      minOrderQty: '',
      leadTime: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={supplier.logoUrl ?? undefined}
              alt={supplier.name}
            />
            <AvatarFallback>{getInitials(supplier.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{supplier.name}</h2>
              <Badge
                variant={supplier.status === 'active' ? 'success' : 'secondary'}
              >
                {supplier.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {supplier.contactPerson && (
              <p className="text-muted-foreground">
                Contact: {supplier.contactPerson}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 mt-1">
              {supplier.email && <p className="text-sm">{supplier.email}</p>}
              {supplier.phone && <p className="text-sm">{supplier.phone}</p>}
            </div>
            {supplier.website && (
              <a
                href={supplier.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary flex items-center gap-1 mt-1 hover:underline"
              >
                {supplier.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
        <Button variant="outline" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Supplier
        </Button>
      </div>

      {supplier.address && (
        <div>
          <h3 className="text-sm font-medium mb-1">Address</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {supplier.address}
          </p>
        </div>
      )}

      {supplier.notes && (
        <div>
          <h3 className="text-sm font-medium mb-1">Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {supplier.notes}
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products & Pricing</CardTitle>
            <Button onClick={() => setIsAddingProduct(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Supplier Products</h3>
              <div className="relative w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Item Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Price (RM)</TableHead>
                    <TableHead className="text-right">Min. Order</TableHead>
                    <TableHead>Lead Time</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        {supplier.products.length === 0
                          ? 'No products for this supplier. Add products using the button above.'
                          : 'No products match your search.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => {
                      const item = getItemById(product.itemId);
                      if (!item) return null;

                      return (
                        <TableRow key={product.itemId}>
                          <TableCell className="font-mono">
                            {item.code}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">
                            {product.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.minOrderQty}
                          </TableCell>
                          <TableCell>
                            {product.leadTime > 0
                              ? `${product.leadTime} days`
                              : 'Immediate'}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {product.lastUpdated
                              ? format(
                                  new Date(product.lastUpdated),
                                  'dd MMM yyyy'
                                )
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveProduct(product.itemId)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove product</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog
        open={isAddingProduct}
        onOpenChange={(open) => {
          setIsAddingProduct(open);
          if (!open) resetNewProduct();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Add a product and its pricing information for this supplier
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item">Select Item</Label>
              <Select
                value={newProduct.itemId}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, itemId: value })
                }
              >
                <SelectTrigger id="item">
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {availableItems
                    .filter(
                      (item) =>
                        !supplier.products.some((p) => p.itemId === item.id)
                    )
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.code} - {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (RM)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minOrderQty">Minimum Order Quantity</Label>
                <Input
                  id="minOrderQty"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={newProduct.minOrderQty}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      minOrderQty: e.target.value
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadTime">Lead Time (days)</Label>
              <Input
                id="leadTime"
                type="number"
                min="0"
                placeholder="0"
                value={newProduct.leadTime}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, leadTime: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground">
                Enter 0 for immediate availability
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Additional information about this product"
                value={newProduct.notes}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddingProduct(false);
                resetNewProduct();
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddProduct}
              disabled={!newProduct.itemId || !newProduct.price}
            >
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
