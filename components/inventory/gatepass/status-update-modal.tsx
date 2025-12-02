'use client';

import type React from 'react';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Gatepass, GatepassStatus } from '@/types/gatepass';
import ImageUploader from './image-uploader';

interface StatusUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { status: GatepassStatus; notes: string; returnDate?: string; images: File[] }) => void
  gatepass: Gatepass
}

export default function StatusUpdateModal({ isOpen, onClose, onSubmit, gatepass }: StatusUpdateModalProps) {
  const [status, setStatus] = useState<GatepassStatus>(gatepass.status);
  const [notes, setNotes] = useState('');
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    gatepass.actualReturnDate ? new Date(gatepass.actualReturnDate) : undefined,
  );
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      status,
      notes,
      returnDate: returnDate?.toISOString(),
      images: uploadedImages,
    });
  };

  const handleImageUpload = (files: File[]) => {
    setUploadedImages(files);
  };

  // Determine available status options based on current status
  const getAvailableStatuses = (): GatepassStatus[] => {
    switch (gatepass.status) {
      case 'Pending Approval':
        return ['Approved', 'Pending Approval'];
      case 'Approved':
        return ['Out', 'Approved'];
      case 'Out':
        return ['Returned', 'Replaced', 'Out'];
      case 'Returned':
      case 'Replaced':
        return [gatepass.status]; // Can't change once in final state
      default:
        return ['Pending Approval', 'Approved', 'Out', 'Returned', 'Replaced'];
    }
  };

  const requiresImage = status === 'Returned' || status === 'Replaced';
  const isStatusChange = status !== gatepass.status;
  const availableStatuses = getAvailableStatuses();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as GatepassStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {statusOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(status === 'Returned' || status === 'Replaced') && (
            <div className="space-y-2">
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal', !returnDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this status update"
            />
          </div>

          {isStatusChange && requiresImage && (
            <div className="space-y-2">
              <Label>Upload Status Image</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Please upload an image showing the current condition of the item
              </p>
              <ImageUploader onImagesSelected={handleImageUpload} maxFiles={1} />

              {uploadedImages.length === 0 && (
                <p className="text-sm text-red-500 mt-1">An image is required for {status} status</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={requiresImage && isStatusChange && uploadedImages.length === 0}>
              Update Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

