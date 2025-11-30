'use client';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EditableTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowDelete?: (index: number) => void
}

export function EditableTable<TData, TValue>({ columns, data, onRowDelete }: EditableTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} style={{ width: (header.column.columnDef as any).width }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
              {onRowDelete && <TableHead style={{ width: 50 }}>Actions</TableHead>}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
                {onRowDelete && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRowDelete(row.index)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete row</span>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (onRowDelete ? 1 : 0)} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

