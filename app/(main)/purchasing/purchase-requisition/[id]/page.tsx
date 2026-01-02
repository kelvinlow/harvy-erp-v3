'use client';

export const runtime = 'edge';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { PurchaseFlowStepper } from '@/components/purchase-flow-stepper';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarIcon,
  FileText,
  Printer,
  User,
  Building,
  DollarSign,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface PurchaseRequisition {
  id: number;
  prNumber: string;
  status: string;
  title: string;
  createdAt: string;
  requestedBy: string;
  department: string;
  company: string;
  urgency: string;
  totalAmount: number;
  currency: string;
  notes: string;
  items: Array<{
    id: number;
    stockCode: string;
    description: string;
    quantity: number;
    uom: string;
    unitPrice: number;
    totalPrice: number;
  }>;
  approvals: Array<{
    stage: string;
    approver: string;
    status: string;
    date: string | null;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  history: Array<{
    action: string;
    user: string;
    timestamp: string;
    notes: string;
  }>;
}

export default function PurchaseRequisitionPage() {
  const { toast } = useToast();
  const params = useParams();
  const [pr, setPr] = React.useState<PurchaseRequisition | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function fetchPR() {
      if (!params.id) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://havys-erp-worker-production.lowshinsheng.workers.dev/api/v1/purchase-requisitions/${params.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          if (response.status === 404)
            throw new Error('Purchase Requisition not found');
          throw new Error('Failed to fetch purchase requisition');
        }

        const json = await response.json();
        setPr(json.data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            err instanceof Error ? err.message : 'Failed to load data'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPR();
  }, [params.id, toast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !pr) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-semibold text-destructive">
          {error || 'Requisition not found'}
        </h2>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Purchase Requisition #{pr.prNumber || pr.id}
            </h1>
            <p className="text-muted-foreground">{pr.title}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button size="sm">Take Action</Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center">
          <Badge variant="outline" className="px-3 py-1 text-sm uppercase">
            Status: {pr.status.replace(/_/g, ' ')}
          </Badge>
        </div>

        {/* Purchase Flow Stepper */}
        <Card>
          <CardHeader>
            <CardTitle>Requisition Progress</CardTitle>
            <CardDescription>
              Current stage in the purchase requisition workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PurchaseFlowStepper currentStatus={pr.status as any} />
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Requisition Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Date
                    </span>
                    <span className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {pr.createdAt
                        ? format(new Date(pr.createdAt), 'PPP')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Requested By
                    </span>
                    <span className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {pr.requestedBy}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Department
                    </span>
                    <span className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      {pr.department}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Company
                    </span>
                    <span className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      {pr.company}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Total Amount
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      {pr.totalAmount.toFixed(2)} {pr.currency}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Urgency
                    </span>
                    <span className="flex items-center">
                      <Badge
                        variant={
                          pr.urgency === 'High'
                            ? 'destructive'
                            : pr.urgency === 'Medium'
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {pr.urgency}
                      </Badge>
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Notes
                  </h3>
                  <p className="mt-1 text-sm">
                    {pr.notes || 'No notes provided.'}
                  </p>
                </div>

                {/* Attachments */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Attachments
                  </h3>
                  <div className="mt-2 space-y-2">
                    {pr.attachments && pr.attachments.length > 0 ? (
                      pr.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center rounded-md border p-2"
                        >
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.size} • Uploaded by{' '}
                              {attachment.uploadedBy} on{' '}
                              {attachment.uploadedAt
                                ? format(new Date(attachment.uploadedAt), 'PP')
                                : ''}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No attachments.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Requisition Items</CardTitle>
                <CardDescription>
                  Items requested in this purchase requisition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Item Code
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Description
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium">
                          UOM
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pr.items.map((item, index) => (
                        <tr
                          key={item.id}
                          className={
                            index !== pr.items.length - 1 ? 'border-b' : ''
                          }
                        >
                          <td className="px-4 py-3 text-sm">
                            {item.stockCode}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {item.description}
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-center text-sm">
                            {item.uom}
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {item.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t">
                        <td
                          colSpan={5}
                          className="px-4 py-3 text-right text-sm font-medium"
                        >
                          Total:
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-bold">
                          {pr.totalAmount.toFixed(2)} {pr.currency}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Approval Workflow</CardTitle>
                <CardDescription>
                  Current approval status and history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pr.approvals.map((approval, index) => (
                    <div
                      key={approval.stage}
                      className="flex items-start space-x-4 rounded-md border p-4"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          approval.status === 'Approved'
                            ? 'bg-green-100'
                            : approval.status === 'Pending'
                            ? 'bg-amber-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <ClipboardList
                          className={`h-5 w-5 ${
                            approval.status === 'Approved'
                              ? 'text-green-600'
                              : approval.status === 'Pending'
                              ? 'text-amber-600'
                              : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">
                          Stage {index + 1}: {approval.stage.replace(/_/g, ' ')}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <User className="mr-1 h-4 w-4" />
                          Approver: {approval.approver}
                        </div>
                        <div className="mt-2 flex items-center">
                          <Badge
                            variant={
                              approval.status === 'Approved'
                                ? 'success'
                                : approval.status === 'Pending'
                                ? 'outline'
                                : 'secondary'
                            }
                            className={
                              approval.status === 'Approved'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : ''
                            }
                          >
                            {approval.status}
                          </Badge>
                          {approval.date && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {format(new Date(approval.date), 'PPP')}
                            </span>
                          )}
                        </div>
                      </div>
                      {approval.status === 'Pending' && (
                        <Button size="sm">Approve</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>
                  Timeline of actions taken on this requisition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pr.history.map((event, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-none">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        {index !== pr.history.length - 1 && (
                          <div className="mx-auto mt-1 h-12 w-0.5 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">
                            {event.action}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {event.timestamp
                              ? format(new Date(event.timestamp), 'PPp')
                              : ''}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          By: {event.user}
                        </p>
                        {event.notes && (
                          <p className="mt-2 text-sm">{event.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
