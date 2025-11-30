'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UOMTable } from './uom-table';
import { UOMDialog } from './uom-dialog';
import { DeleteConfirmation } from '@/components/delete-confirmation';
import type { UOM, UOMRelationship } from '@/types/uom';

// Mock data
const mockUoms: UOM[] = [
  {
    id: '1',
    code: 'BAG',
    description: 'BAG',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'BOT',
    description: 'BOTTLE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    code: 'BOX',
    description: 'BOX',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    code: 'CAN',
    description: 'CAN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    code: 'CARBOY',
    description: 'CARBOY',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    code: 'CART',
    description: 'CARTON',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    code: 'COIL',
    description: 'COIL',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    code: 'CYL',
    description: 'CYLINDER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    code: 'DAY',
    description: 'DAY',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    code: 'DOZEN',
    description: 'DOZEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '11',
    code: 'DRUM',
    description: 'DRUM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '12',
    code: 'FT',
    description: 'FEET',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '13',
    code: 'GAL',
    description: 'GALLON',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '14',
    code: 'INC',
    description: 'INCH',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '15',
    code: 'JOB',
    description: 'JOB',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '16',
    code: 'KG',
    description: 'KILOGRAMS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '17',
    code: 'KM',
    description: 'KILOMETERS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '18',
    code: 'LGTH',
    description: 'LENGTH',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '19',
    code: 'LOT',
    description: 'LOT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '20',
    code: 'LTR',
    description: 'LITER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '21',
    code: 'MTR',
    description: 'METER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '22',
    code: 'NIGHT',
    description: 'NIGHT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '23',
    code: 'NO',
    description: 'NO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '24',
    code: 'PAD',
    description: 'PAD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '25',
    code: 'PAIL',
    description: 'PAIL',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '26',
    code: 'PAIR',
    description: 'PAIR',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '27',
    code: 'PAL',
    description: 'PALLET',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '28',
    code: 'PCS',
    description: 'PIECES',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '29',
    code: 'PERSON',
    description: 'PERSON',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '30',
    code: 'PKT',
    description: 'PACKET',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '31',
    code: 'POINT',
    description: 'POINT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '32',
    code: 'REAM',
    description: 'REAM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '33',
    code: 'ROLL',
    description: 'ROLL',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '34',
    code: 'SET',
    description: 'SET',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '35',
    code: 'SHEET',
    description: 'SHEET',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '36',
    code: 'TIME',
    description: 'TIME',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '37',
    code: 'TIN',
    description: 'TIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '38',
    code: 'TON',
    description: 'TON',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '39',
    code: 'TRIP',
    description: 'TRIP',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '40',
    code: 'TUBE',
    description: 'TUBE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '41',
    code: 'UNIT',
    description: 'UNIT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '42',
    code: 'BDL',
    description: 'BUNDLE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function UOMMaster() {
  const [uoms, setUoms] = React.useState<UOM[]>(mockUoms);
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
      // In a real app, you would call an API here
      setUoms(uoms.filter((uom) => uom.id !== uomToDelete.id));
      setDeleteOpen(false);
      setUomToDelete(null);
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
      // In a real app, you would call an API here
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
    }
  };

  const handleSave = async (
    data: Partial<UOM> & { relationships?: UOMRelationship[] }
  ) => {
    if (selectedUom) {
      // Update existing UOM
      setUoms(
        uoms.map((uom) =>
          uom.id === selectedUom.id
            ? {
                ...selectedUom,
                ...data,
                relationships:
                  data.relationships || selectedUom.relationships || [],
                updatedAt: new Date().toISOString()
              }
            : uom
        )
      );
    } else {
      // Create new UOM
      const newUom: UOM = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        relationships: data.relationships || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as UOM;
      setUoms([...uoms, newUom]);
    }
    setOpen(false);
  };

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
