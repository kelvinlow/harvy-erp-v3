'use client';

import { forwardRef } from 'react';
import { format } from 'date-fns';
import type { PurchaseRequisition } from '@/types';

export const PurchaseRequisitionPrint = forwardRef<HTMLDivElement, { data: PurchaseRequisition }>(
  function PurchaseRequisitionPrint({ data }, ref) {
    return (
      <div ref={ref} className="bg-white p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Purchase Requisition</h1>
          <p className="text-muted-foreground">#{data.requisitionOrder}</p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-2 font-semibold">From:</h3>
            <p>{data.employeeName}</p>
            <p>Employee No: {data.employeeNo}</p>
            <p>Date: {format(new Date(data.date), 'PPP')}</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">To:</h3>
            <p>{data.supplierName}</p>
            <p>Supplier No: {data.supplierNo}</p>
            <p>Reference: {data.referenceNo}</p>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Stock Code</th>
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-right">Quantity</th>
              <th className="py-2 text-center">UOM</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.stockCode}</td>
                <td className="py-2">{item.description}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-center">{item.uom}</td>
                <td className="py-2 text-right">{item.unitPrice.toFixed(2)}</td>
                <td className="py-2 text-right">{item.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}></td>
              <td className="py-2 text-right font-semibold">Subtotal:</td>
              <td className="py-2 text-right">{data.subTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={4}></td>
              <td className="py-2 text-right font-semibold">Tax:</td>
              <td className="py-2 text-right">{data.taxAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={4}></td>
              <td className="py-2 text-right font-semibold">Total:</td>
              <td className="py-2 text-right font-semibold">{data.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-8">
          <h3 className="mb-2 font-semibold">Remarks:</h3>
          <p className="whitespace-pre-wrap">{data.remarks}</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mb-8 h-px bg-border" />
            <p className="font-semibold">{data.orderedBy.name}</p>
            <p className="text-sm text-muted-foreground">Ordered By</p>
            <p className="text-sm text-muted-foreground">{format(new Date(data.orderedBy.date), 'PPP')}</p>
          </div>
          <div className="text-center">
            <div className="mb-8 h-px bg-border" />
            <p className="font-semibold">{data.seenBy.map((person) => person.initial).join(', ')}</p>
            <p className="text-sm text-muted-foreground">Seen By</p>
            <p className="text-sm text-muted-foreground">{format(new Date(data.seenBy[0].date), 'PPP')}</p>
          </div>
          <div className="text-center">
            <div className="mb-8 h-px bg-border" />
            <p className="font-semibold">{data.authorizedBy.name}</p>
            <p className="text-sm text-muted-foreground">Authorized By</p>
            <p className="text-sm text-muted-foreground">{format(new Date(data.authorizedBy.date), 'PPP')}</p>
          </div>
        </div>
      </div>
    );
  },
);

