'use client';

import { useState } from 'react';
import { Edit2, Search, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import type { UOM } from '@/types/uom';

interface UOMTableProps {
  data: UOM[];
  onEdit: (uom: UOM) => void;
  onDelete: (uom: UOM) => void;
  onDeleteRelationship: (uomId: string, relationshipId: string) => void;
}

export function UOMTable({
  data,
  onEdit,
  onDelete,
  onDeleteRelationship
}: UOMTableProps) {
  const [search, setSearch] = useState('');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredData = data.filter(
    (uom) =>
      uom.code.toLowerCase().includes(search.toLowerCase()) ||
      uom.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search UOMs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>UOM Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Relationships</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((uom) => (
              <Collapsible
                key={uom.id}
                open={expandedRows[uom.id]}
                onOpenChange={() => toggleRow(uom.id)}
                asChild
              >
                <>
                  <TableRow className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          {expandedRows[uom.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="font-medium">{uom.code}</TableCell>
                    <TableCell>{uom.description}</TableCell>
                    <TableCell>
                      {uom.relationships && uom.relationships.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {uom.relationships.map((rel) => (
                            <Badge
                              key={rel.id}
                              variant="outline"
                              className="text-xs"
                            >
                              1 {uom.code} = {rel.conversionRate}{' '}
                              {rel.toUOMCode}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No relationships
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(uom)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(uom)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    {uom.relationships && uom.relationships.length > 0 ? (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={5} className="p-0">
                          <div className="px-4 py-3">
                            <h4 className="mb-2 text-sm font-medium">
                              UOM Relationships
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>From</TableHead>
                                  <TableHead>To</TableHead>
                                  <TableHead>Conversion Rate</TableHead>
                                  <TableHead className="w-[80px]">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {uom.relationships.map((rel) => (
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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onDeleteRelationship(uom.id, rel.id);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
