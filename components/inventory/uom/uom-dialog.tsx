'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Trash2, Loader2, Plus } from 'lucide-react';

const formSchema = z.object({
  code: z.string().min(2, {
    message: 'UOM code must be at least 2 characters.'
  }),
  description: z.string().min(2, {
    message: 'Description must be at least 2 characters.'
  })
});

export interface UOMDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uom: UOM | null;
  uoms: UOM[];
  onSubmit: (data: Partial<UOM>) => Promise<void>;
}

export interface UOM {
  id: string;
  code: string;
  description: string;
  relationships?: UOMRelationship[];
}

export interface UOMRelationship {
  id: string;
  fromUOMId: string;
  toUOMId: string;
  conversionRate: number;
  fromUOMCode?: string;
  toUOMCode?: string;
}

export function UOMDialog({
  open,
  onOpenChange,
  uom,
  uoms,
  onSubmit
}: UOMDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('details');
  const [relationships, setRelationships] = React.useState<UOMRelationship[]>(
    uom?.relationships || []
  );
  const [newRelationship, setNewRelationship] = React.useState<{
    toUOMId: string;
    conversionRate: string;
  }>({
    toUOMId: '',
    conversionRate: ''
  });

  const form = useForm<{
    code: string;
    description: string;
  }>({
    defaultValues: {
      code: uom?.code || '',
      description: uom?.description || ''
    }
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        code: uom?.code || '',
        description: uom?.description || ''
      });
      setRelationships(uom?.relationships || []);
      setActiveTab('details');
    }
  }, [open, uom, form]);

  const handleSubmit = async (data: { code: string; description: string }) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, relationships });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRelationship = () => {
    if (!newRelationship.toUOMId || !newRelationship.conversionRate || !uom) {
      return;
    }

    const targetUOM = uoms.find((u) => u.id === newRelationship.toUOMId);
    if (!targetUOM) return;

    const newRel: UOMRelationship = {
      id: Math.random().toString(36).substr(2, 9),
      fromUOMId: uom.id,
      toUOMId: newRelationship.toUOMId,
      conversionRate: Number.parseFloat(newRelationship.conversionRate),
      fromUOMCode: uom.code,
      toUOMCode: targetUOM.code
    };

    setRelationships([...relationships, newRel]);
    setNewRelationship({
      toUOMId: '',
      conversionRate: ''
    });
  };

  const handleDeleteRelationship = (id: string) => {
    setRelationships(relationships.filter((rel) => rel.id !== id));
  };

  const filteredUOMs = uoms.filter((u) => u.id !== uom?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{uom ? 'Edit UOM' : 'New UOM'}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">UOM Details</TabsTrigger>
            <TabsTrigger value="relationships" disabled={!uom}>
              Relationships{' '}
              {relationships.length > 0 && `(${relationships.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Form {...form}>
              <form
                id="uom-form"
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UOM Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter UOM code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="relationships">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-3">
                  Add New Relationship
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From UOM</label>
                    <Input value={uom?.code || ''} disabled />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">To UOM</label>
                    <Select
                      value={newRelationship.toUOMId}
                      onValueChange={(value) =>
                        setNewRelationship({
                          ...newRelationship,
                          toUOMId: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select UOM" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredUOMs.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.code} - {u.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Conversion Rate
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.0001"
                        min="0.0001"
                        placeholder="Enter rate"
                        value={newRelationship.conversionRate}
                        onChange={(e) =>
                          setNewRelationship({
                            ...newRelationship,
                            conversionRate: e.target.value
                          })
                        }
                      />
                      <Button
                        type="button"
                        onClick={handleAddRelationship}
                        disabled={
                          !newRelationship.toUOMId ||
                          !newRelationship.conversionRate
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  {newRelationship.toUOMId && newRelationship.conversionRate ? (
                    <p>
                      1 {uom?.code} = {newRelationship.conversionRate}{' '}
                      {uoms.find((u) => u.id === newRelationship.toUOMId)?.code}
                    </p>
                  ) : (
                    <p>
                      Select a UOM and enter a conversion rate to create a
                      relationship
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From UOM</TableHead>
                      <TableHead>To UOM</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relationships.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No relationships defined
                        </TableCell>
                      </TableRow>
                    ) : (
                      relationships.map((rel) => (
                        <TableRow key={rel.id}>
                          <TableCell>{rel.fromUOMCode}</TableCell>
                          <TableCell>{rel.toUOMCode}</TableCell>
                          <TableCell>
                            1 {rel.fromUOMCode} = {rel.conversionRate}{' '}
                            {rel.toUOMCode}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRelationship(rel.id)}
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="uom-form" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {uom ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
