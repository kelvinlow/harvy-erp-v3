'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemGroupList } from './item-group-list';
import { ItemGroupForm } from './item-group-form';
import { ItemGroupDetail } from './item-group-detail';
import { mockItemGroups } from '@/data/mock-item-groups';
import { mockStocks } from '@/data/mock-stocks';
import type { ItemGroup } from '@/types/item-group';
import type { Stock } from '@/types/stock';

export function ItemGroupManagement() {
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>(mockItemGroups);
  const [selectedGroup, setSelectedGroup] = useState<ItemGroup | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [availableItems, setAvailableItems] = useState<Stock[]>(mockStocks);

  const handleCreateGroup = (newGroup: ItemGroup) => {
    const newId = `G${itemGroups.length + 1001}`;
    const groupWithId = { ...newGroup, id: newId, items: [] };
    setItemGroups([...itemGroups, groupWithId]);
    setActiveTab('list');
  };

  const handleUpdateGroup = (updatedGroup: ItemGroup) => {
    setItemGroups(
      itemGroups.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group
      )
    );
    setSelectedGroup(null);
    setIsEditing(false);
    setActiveTab('list');
  };

  const handleDeleteGroup = (groupId: string) => {
    setItemGroups(itemGroups.filter((group) => group.id !== groupId));
  };

  const handleEditGroup = (group: ItemGroup) => {
    setSelectedGroup(group);
    setIsEditing(true);
    setActiveTab('add');
  };

  const handleViewGroup = (group: ItemGroup) => {
    setSelectedGroup(group);
    setActiveTab('detail');
  };

  const handleAddItemToGroup = (groupId: string, itemId: string) => {
    // Find the item from available items
    const item = availableItems.find((item) => item.id === itemId);
    if (!item) return;

    // Update the item groups
    setItemGroups(
      itemGroups.map((group) => {
        if (group.id === groupId) {
          // Check if item is already in the group
          if (group.items.some((i) => i.id === itemId)) {
            return group;
          }
          return {
            ...group,
            items: [...group.items, item]
          };
        }
        return group;
      })
    );
  };

  const handleRemoveItemFromGroup = (groupId: string, itemId: string) => {
    setItemGroups(
      itemGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            items: group.items.filter((item) => item.id !== itemId)
          };
        }
        return group;
      })
    );
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Item Group Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage item groups to organize your inventory
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Item Groups</TabsTrigger>
            <TabsTrigger value="add">
              {isEditing ? 'Edit Group' : 'Add New Group'}
            </TabsTrigger>
            {selectedGroup && (
              <TabsTrigger value="detail">Group Details</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Item Groups</CardTitle>
                <CardDescription>
                  Manage your inventory item groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemGroupList
                  itemGroups={itemGroups}
                  onEdit={handleEditGroup}
                  onDelete={handleDeleteGroup}
                  onView={handleViewGroup}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? 'Edit Item Group' : 'Create New Item Group'}
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? 'Update the details of an existing item group'
                    : 'Add a new item group to organize your inventory'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemGroupForm
                  group={selectedGroup}
                  onSubmit={isEditing ? handleUpdateGroup : handleCreateGroup}
                  onCancel={() => {
                    setSelectedGroup(null);
                    setIsEditing(false);
                    setActiveTab('list');
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {selectedGroup && (
            <TabsContent value="detail">
              <Card>
                <CardHeader>
                  <CardTitle>Group Details: {selectedGroup.name}</CardTitle>
                  <CardDescription>Manage items in this group</CardDescription>
                </CardHeader>
                <CardContent>
                  <ItemGroupDetail
                    group={selectedGroup}
                    availableItems={availableItems}
                    onAddItem={(itemId) =>
                      handleAddItemToGroup(selectedGroup.id, itemId)
                    }
                    onRemoveItem={(itemId) =>
                      handleRemoveItemFromGroup(selectedGroup.id, itemId)
                    }
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
      </CardContent>
    </Card>
  );
}
