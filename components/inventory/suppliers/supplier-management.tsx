'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SupplierList } from './supplier-list';
import { SupplierForm } from './supplier-form';
import { SupplierDetail } from './supplier-detail';
import { mockSuppliers } from '@/data/mock-suppliers';
import { mockStocks } from '@/data/mock-stocks';
import type { Supplier, SupplierProduct } from '@/types/supplier';
import type { Stock } from '@/types/stock';

export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [availableItems, setAvailableItems] = useState<Stock[]>(mockStocks);

  const handleCreateSupplier = (newSupplier: Supplier) => {
    const newId = `S${suppliers.length + 1001}`;
    const supplierWithId = { ...newSupplier, id: newId, products: [] };
    setSuppliers([...suppliers, supplierWithId]);
    setActiveTab('list');
  };

  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map((supplier) => (supplier.id === updatedSupplier.id ? updatedSupplier : supplier)));
    setSelectedSupplier(null);
    setIsEditing(false);
    setActiveTab('list');
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierId));
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditing(true);
    setActiveTab('add');
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setActiveTab('detail');
  };

  const handleAddProductToSupplier = (supplierId: string, product: SupplierProduct) => {
    setSuppliers(
      suppliers.map((supplier) => {
        if (supplier.id === supplierId) {
          // Check if product is already in the supplier's list
          const existingProductIndex = supplier.products.findIndex((p) => p.itemId === product.itemId);

          if (existingProductIndex >= 0) {
            // Update existing product
            const updatedProducts = [...supplier.products];
            updatedProducts[existingProductIndex] = product;
            return {
              ...supplier,
              products: updatedProducts,
            };
          } else {
            // Add new product
            return {
              ...supplier,
              products: [...supplier.products, product],
            };
          }
        }
        return supplier;
      }),
    );
  };

  const handleRemoveProductFromSupplier = (supplierId: string, productId: string) => {
    setSuppliers(
      suppliers.map((supplier) => {
        if (supplier.id === supplierId) {
          return {
            ...supplier,
            products: supplier.products.filter((product) => product.itemId !== productId),
          };
        }
        return supplier;
      }),
    );
  };

  const handleToggleSupplierStatus = (supplierId: string) => {
    setSuppliers(
      suppliers.map((supplier) => {
        if (supplier.id === supplierId) {
          return {
            ...supplier,
            status: supplier.status === 'active' ? 'inactive' : 'active',
          };
        }
        return supplier;
      }),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Supplier Management</h1>
        <p className="text-muted-foreground">Manage suppliers and their product offerings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Suppliers</TabsTrigger>
          <TabsTrigger value="add">{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</TabsTrigger>
          {selectedSupplier && <TabsTrigger value="detail">Supplier Details</TabsTrigger>}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
              <CardDescription>Manage your suppliers and their information</CardDescription>
            </CardHeader>
            <CardContent>
              <SupplierList
                suppliers={suppliers}
                onEdit={handleEditSupplier}
                onDelete={handleDeleteSupplier}
                onView={handleViewSupplier}
                onToggleStatus={handleToggleSupplierStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Update supplier information' : 'Add a new supplier to your inventory system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplierForm
                supplier={selectedSupplier}
                onSubmit={isEditing ? handleUpdateSupplier : handleCreateSupplier}
                onCancel={() => {
                  setSelectedSupplier(null);
                  setIsEditing(false);
                  setActiveTab('list');
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {selectedSupplier && (
          <TabsContent value="detail">
            <Card>
              <CardHeader>
                <CardTitle>Supplier: {selectedSupplier.name}</CardTitle>
                <CardDescription>Manage products and pricing for this supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <SupplierDetail
                  supplier={selectedSupplier}
                  availableItems={availableItems}
                  onAddProduct={(product) => handleAddProductToSupplier(selectedSupplier.id, product)}
                  onRemoveProduct={(productId) => handleRemoveProductFromSupplier(selectedSupplier.id, productId)}
                  onEdit={() => {
                    setIsEditing(true);
                    setActiveTab('add');
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

