'use client';

import type React from 'react';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Gatepass } from '@/types/gatepass';
import ImageUploader from './image-uploader';

interface GatepassFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Gatepass>) => void
  initialData?: Partial<Gatepass>
  mode: 'create' | 'update'
}

export default function GatepassForm({ isOpen, onClose, onSubmit, initialData = {}, mode }: GatepassFormProps) {
  const [formData, setFormData] = useState<Partial<Gatepass>>(initialData);
  const [requestDate, setRequestDate] = useState<Date | undefined>(
    initialData.requestDate ? new Date(initialData.requestDate) : new Date(),
  );
  const [expectedReturnDate, setExpectedReturnDate] = useState<Date | undefined>(
    initialData.expectedReturnDate ? new Date(initialData.expectedReturnDate) : undefined,
  );
  const [actualReturnDate, setActualReturnDate] = useState<Date | undefined>(
    initialData.actualReturnDate ? new Date(initialData.actualReturnDate) : undefined,
  );
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imageDescription, setImageDescription] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data for submission
    const submissionData: Partial<Gatepass> = {
      ...formData,
      requestDate: requestDate?.toISOString(),
      expectedReturnDate: expectedReturnDate?.toISOString() || null,
      actualReturnDate: actualReturnDate?.toISOString() || null,
    };

    onSubmit(submissionData);
  };

  const handleImageUpload = (files: File[]) => {
    setUploadedImages(files);
  };

  const isStatusUpdate = mode === 'update' && initialData.status;
  const showReturnImageUpload =
    isStatusUpdate &&
    (formData.status === 'Returned' || formData.status === 'Replaced') &&
    initialData.status !== 'Returned' &&
    initialData.status !== 'Replaced';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Gatepass' : 'Update Gatepass'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Item Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  name="itemName"
                  value={formData.itemName || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemId">Item ID</Label>
                <Input id="itemId" name="itemId" value={formData.itemId || ''} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemType">Item Type</Label>
                <Select
                  value={formData.itemType || ''}
                  onValueChange={(value) => handleSelectChange('itemType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Item">Item</SelectItem>
                    <SelectItem value="Machinery">Machinery</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Tool">Tool</SelectItem>
                    <SelectItem value="Vehicle">Vehicle</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity || 1}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Request Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Request Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Request Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !requestDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {requestDate ? format(requestDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={requestDate} onSelect={setRequestDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Expected Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !expectedReturnDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expectedReturnDate ? format(expectedReturnDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expectedReturnDate}
                      onSelect={setExpectedReturnDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {isStatusUpdate && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status || ''} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Out">Out</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                    <SelectItem value="Replaced">Replaced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(formData.status === 'Returned' || formData.status === 'Replaced') && (
              <div className="space-y-2">
                <Label>Actual Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !actualReturnDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {actualReturnDate ? format(actualReturnDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={actualReturnDate} onSelect={setActualReturnDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea id="reason" name="reason" value={formData.reason || ''} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleInputChange} />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {mode === 'create'
                ? 'Initial Status Image'
                : showReturnImageUpload
                  ? `${formData.status} Status Image`
                  : 'Status Image'}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="imageDescription">Image Description</Label>
              <Input
                id="imageDescription"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="Describe the condition of the item"
              />
            </div>

            <ImageUploader onImagesSelected={handleImageUpload} />

            {uploadedImages.length > 0 && (
              <div className="text-sm text-green-600">{uploadedImages.length} image(s) selected for upload</div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{mode === 'create' ? 'Create Gatepass' : 'Update Gatepass'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

