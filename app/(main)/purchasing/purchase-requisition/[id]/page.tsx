import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
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
  ClipboardList
} from 'lucide-react';
import { format } from 'date-fns';

// This would normally come from your database
const mockPurchaseRequisition = {
  id: 'PR001',
  status: 'MANAGER_APPROVAL_1',
  title: 'Office Supplies Requisition',
  date: '2025-03-15',
  requestedBy: 'John Doe',
  department: 'Administration',
  company: 'Nova Gadget House',
  urgency: 'Medium',
  totalAmount: 1250.75,
  currency: 'USD',
  notes: 'Required for the new office setup',
  items: [
    {
      id: '1',
      stockCode: 'A123',
      description: 'Office Desk',
      quantity: 5,
      uom: 'EA',
      unitPrice: 150.0,
      totalPrice: 750.0
    },
    {
      id: '2',
      stockCode: 'B456',
      description: 'Office Chair',
      quantity: 5,
      uom: 'EA',
      unitPrice: 85.5,
      totalPrice: 427.5
    },
    {
      id: '3',
      stockCode: 'C789',
      description: 'Filing Cabinet',
      quantity: 2,
      uom: 'EA',
      unitPrice: 36.75,
      totalPrice: 73.5
    }
  ],
  approvals: [
    {
      stage: 'MANAGER_APPROVAL_1',
      approver: 'Jane Smith',
      status: 'Pending',
      date: null
    },
    {
      stage: 'MANAGER_APPROVAL_2',
      approver: 'Mike Johnson',
      status: 'Not Started',
      date: null
    },
    {
      stage: 'MANAGER_APPROVAL_3',
      approver: 'Sarah Williams',
      status: 'Not Started',
      date: null
    }
  ],
  attachments: [
    {
      id: 'att1',
      name: 'Requirements.pdf',
      size: '1.2 MB',
      uploadedBy: 'John Doe',
      uploadedAt: '2025-03-15'
    }
  ],
  history: [
    {
      action: 'Created',
      user: 'John Doe',
      timestamp: '2025-03-15T09:30:00Z',
      notes: 'Initial requisition created'
    },
    {
      action: 'Submitted for Approval',
      user: 'John Doe',
      timestamp: '2025-03-15T10:15:00Z',
      notes: 'Submitted to Jane Smith for approval'
    }
  ]
};

export default function PurchaseRequisitionPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Purchase Requisition #{params.id}
              </h1>
              <p className="text-muted-foreground">
                {mockPurchaseRequisition.title}
              </p>
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
            <Badge variant="outline" className="px-3 py-1 text-sm">
              Status: {mockPurchaseRequisition.status.replace(/_/g, ' ')}
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
              <PurchaseFlowStepper
                currentStatus={mockPurchaseRequisition.status as any}
              />
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
                        {format(new Date(mockPurchaseRequisition.date), 'PPP')}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Requested By
                      </span>
                      <span className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {mockPurchaseRequisition.requestedBy}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Department
                      </span>
                      <span className="flex items-center">
                        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                        {mockPurchaseRequisition.department}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Company
                      </span>
                      <span className="flex items-center">
                        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                        {mockPurchaseRequisition.company}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Total Amount
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                        {mockPurchaseRequisition.totalAmount.toFixed(2)}{' '}
                        {mockPurchaseRequisition.currency}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Urgency
                      </span>
                      <span className="flex items-center">
                        <Badge
                          variant={
                            mockPurchaseRequisition.urgency === 'High'
                              ? 'destructive'
                              : mockPurchaseRequisition.urgency === 'Medium'
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {mockPurchaseRequisition.urgency}
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
                      {mockPurchaseRequisition.notes}
                    </p>
                  </div>

                  {/* Attachments */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Attachments
                    </h3>
                    <div className="mt-2 space-y-2">
                      {mockPurchaseRequisition.attachments.map((attachment) => (
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
                              {format(new Date(attachment.uploadedAt), 'PP')}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
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
                        {mockPurchaseRequisition.items.map((item, index) => (
                          <tr
                            key={item.id}
                            className={
                              index !== mockPurchaseRequisition.items.length - 1
                                ? 'border-b'
                                : ''
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
                            {mockPurchaseRequisition.totalAmount.toFixed(2)}{' '}
                            {mockPurchaseRequisition.currency}
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
                    {mockPurchaseRequisition.approvals.map(
                      (approval, index) => (
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
                              Stage {index + 1}:{' '}
                              {approval.stage.replace(/_/g, ' ')}
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
                      )
                    )}
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
                    {mockPurchaseRequisition.history.map((event, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-none">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          {index !==
                            mockPurchaseRequisition.history.length - 1 && (
                            <div className="mx-auto mt-1 h-12 w-0.5 bg-border" />
                          )}
                        </div>
                        <div className="flex-1 rounded-md border p-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">
                              {event.action}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(event.timestamp), 'PPp')}
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
      </SidebarProvider>
    </div>
  );
}
