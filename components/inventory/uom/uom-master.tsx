'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UOMTable } from './uom-table';
import { UOMDialog } from './uom-dialog';
import { DeleteConfirmation } from '@/components/delete-confirmation';
import { useToast } from '@/components/ui/use-toast';
import type { UOM, UOMRelationship } from '@/types/uom';
import { Loader2 } from 'lucide-react';

export function UOMMaster() {
  const { toast } = useToast();
  const [uoms, setUoms] = React.useState<UOM[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedUom, setSelectedUom] = React.useState<UOM | null>(null);
  const [uomToDelete, setUomToDelete] = React.useState<UOM | null>(null);
  const [relationshipToDelete, setRelationshipToDelete] = React.useState<{
    uomId: string;
    relationshipId: string;
  } | null>(null);
  const [deleteRelationshipOpen, setDeleteRelationshipOpen] =
    React.useState(false);

  // Fetch Uoms
  const fetchUoms = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api/v1'
        }/uom`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      if (data.data) {
        setUoms(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch UOMs:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch UOMs.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchUoms();
  }, [fetchUoms]);

  const handleCreate = () => {
    setSelectedUom(null);
    setOpen(true);
  };

  const handleEdit = (uom: UOM) => {
    setSelectedUom(uom);
    setOpen(true);
  };

  const handleDeleteClick = (uom: UOM) => {
    setUomToDelete(uom);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (uomToDelete) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api/v1'
          }/uom/${uomToDelete.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete UOM');
        }

        toast({
          title: 'Success',
          description: 'UOM deleted successfully.'
        });
        fetchUoms();
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete UOM.'
        });
      } finally {
        setDeleteOpen(false);
        setUomToDelete(null);
      }
    }
  };

  const handleDeleteRelationshipClick = (
    uomId: string,
    relationshipId: string
  ) => {
    setRelationshipToDelete({ uomId, relationshipId });
    setDeleteRelationshipOpen(true);
  };

  const handleDeleteRelationshipConfirm = async () => {
    if (relationshipToDelete) {
      // Todo: Call an API here (relationships not implemented in DB yet)
      setUoms(
        uoms.map((uom) => {
          if (uom.id === relationshipToDelete.uomId) {
            return {
              ...uom,
              relationships:
                uom.relationships?.filter(
                  (rel) => rel.id !== relationshipToDelete.relationshipId
                ) || []
            };
          }
          return uom;
        })
      );
      setDeleteRelationshipOpen(false);
      setRelationshipToDelete(null);
      toast({
        title: 'Success',
        description: 'Relationship deleted (local only).'
      });
    }
  };

  const handleSave = async (
    data: Partial<UOM> & { relationships?: UOMRelationship[] }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const url = `${
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api/v1'
      }/uom${selectedUom ? `/${selectedUom.id}` : ''}`;

      const response = await fetch(url, {
        method: selectedUom ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save UOM');
      }

      toast({
        title: 'Success',
        description: `UOM ${selectedUom ? 'updated' : 'created'} successfully.`
      });
      fetchUoms();
      setOpen(false);
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save UOM.'
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>UOM Master</CardTitle>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New UOM
        </Button>
      </CardHeader>
      <CardContent>
        <UOMTable
          data={uoms}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onDeleteRelationship={handleDeleteRelationshipClick}
        />
        <UOMDialog
          open={open}
          onOpenChange={setOpen}
          uom={selectedUom}
          uoms={uoms}
          onSubmit={handleSave}
        />
        <DeleteConfirmation
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete UOM"
          description={`Are you sure you want to delete ${uomToDelete?.code}? This action cannot be undone.`}
        />
        <DeleteConfirmation
          open={deleteRelationshipOpen}
          onOpenChange={setDeleteRelationshipOpen}
          onConfirm={handleDeleteRelationshipConfirm}
          title="Delete UOM Relationship"
          description="Are you sure you want to delete this UOM relationship? This action cannot be undone."
        />
      </CardContent>
    </Card>
  );
}
