'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, DollarSign, FileText, User, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export type ApprovalItemType = 'PURCHASE_REQUISITION' | 'PURCHASE_ORDER'

export interface ApprovalItem {
  id: string
  type: ApprovalItemType
  title: string
  requestedBy: string
  requestedDate: string
  amount: number
  currency: string
  urgency: 'Low' | 'Medium' | 'High'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

interface MobileApprovalCardProps {
  item: ApprovalItem
  onApprove: (id: string, comments: string) => Promise<void>
  onReject: (id: string, comments: string) => Promise<void>
}

export function MobileApprovalCard({ item, onApprove, onReject }: MobileApprovalCardProps) {
  const router = useRouter();
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewDetails = () => {
    if (item.type === 'PURCHASE_REQUISITION') {
      router.push(`/purchase-requisition/${item.id}`);
    } else {
      router.push(`/purchase-order/${item.id}`);
    }
  };

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onApprove(item.id, comments);
      setShowApproveDialog(false);
    } catch (err) {
      setError('Failed to approve. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onReject(item.id, comments);
      setShowRejectDialog(false);
    } catch (err) {
      setError('Failed to reject. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant={item.type === 'PURCHASE_REQUISITION' ? 'default' : 'secondary'} className="mb-2">
              {item.type === 'PURCHASE_REQUISITION' ? 'Requisition' : 'Purchase Order'}
            </Badge>
            <Badge
              variant={item.urgency === 'High' ? 'destructive' : item.urgency === 'Medium' ? 'default' : 'outline'}
            >
              {item.urgency}
            </Badge>
          </div>
          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
          <CardDescription className="flex items-center mt-1">
            <FileText className="h-3.5 w-3.5 mr-1" />
            ID: {item.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <div className="flex items-center text-muted-foreground">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>Requested by:</span>
              </div>
              <span className="font-medium">{item.requestedBy}</span>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>Date:</span>
              </div>
              <span className="font-medium">{format(new Date(item.requestedDate), 'MMM d, yyyy')}</span>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                <span>Amount:</span>
              </div>
              <span className="font-medium">
                {item.amount.toLocaleString()} {item.currency}
              </span>
            </div>
          </div>

          {item.status !== 'PENDING' && (
            <div
              className={cn(
                'mt-4 p-2 rounded-md text-sm flex items-center',
                item.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
              )}
            >
              {item.status === 'APPROVED' ? (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              <span>{item.status === 'APPROVED' ? 'Approved' : 'Rejected'}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-0">
          <Button variant="outline" className="w-full justify-start" onClick={handleViewDetails}>
            <FileText className="mr-2 h-4 w-4" />
            View Details
          </Button>

          {item.status === 'PENDING' && (
            <div className="flex w-full space-x-2">
              <Button variant="destructive" className="flex-1" onClick={() => setShowRejectDialog(true)}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button variant="default" className="flex-1" onClick={() => setShowApproveDialog(true)}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}

          {error && (
            <div className="w-full p-2 mt-2 text-sm bg-red-50 text-red-700 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Approve {item.type === 'PURCHASE_REQUISITION' ? 'Requisition' : 'Purchase Order'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to approve {item.id}. Please provide any comments if necessary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Textarea
              placeholder="Add comments (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleApprove();
              }}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Processing...' : 'Approve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Reject {item.type === 'PURCHASE_REQUISITION' ? 'Requisition' : 'Purchase Order'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to reject {item.id}. Please provide a reason for rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Textarea
              placeholder="Reason for rejection (required)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (!comments.trim()) {
                  setError('Please provide a reason for rejection');
                  return;
                }
                handleReject();
              }}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? 'Processing...' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

