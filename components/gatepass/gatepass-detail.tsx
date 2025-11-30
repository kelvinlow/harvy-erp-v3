'use client';

import type React from 'react';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar, Package, User, MapPin, FileText, Paperclip, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Gatepass, GatepassImage } from '@/types/gatepass';
import { formatDate, formatDateTime } from '@/lib/utils';
import StatusBadge from './status-badge';
import ImageGallery from './image-gallery';

interface GatepassDetailProps {
  gatepass: Gatepass
  onClose: () => void
}

export default function GatepassDetail({ gatepass, onClose }: GatepassDetailProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GatepassImage | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleImageClick = (image: GatepassImage) => {
    setSelectedImage(image);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const renderStatusTimeline = () => {
    const statuses: { status: string; icon: React.ReactNode; date: string | null; completed: boolean }[] = [
      {
        status: 'Request Submitted',
        icon: <FileText className="h-5 w-5" />,
        date: gatepass.requestDate,
        completed: true,
      },
      {
        status: 'Approval',
        icon: <CheckCircle2 className="h-5 w-5" />,
        date: gatepass.status !== 'Pending Approval' ? gatepass.updatedAt : null,
        completed: gatepass.status !== 'Pending Approval',
      },
      {
        status: 'Item Out',
        icon: <Package className="h-5 w-5" />,
        date:
          gatepass.status === 'Out' || gatepass.status === 'Returned' || gatepass.status === 'Replaced'
            ? gatepass.updatedAt
            : null,
        completed: gatepass.status === 'Out' || gatepass.status === 'Returned' || gatepass.status === 'Replaced',
      },
      {
        status: 'Return/Replace',
        icon: <Clock className="h-5 w-5" />,
        date: gatepass.status === 'Returned' || gatepass.status === 'Replaced' ? gatepass.actualReturnDate : null,
        completed: gatepass.status === 'Returned' || gatepass.status === 'Replaced',
      },
    ];

    return (
      <div className="space-y-4 mt-4">
        <h3 className="text-lg font-medium">Status Timeline</h3>
        <div className="relative">
          {statuses.map((item, index) => (
            <div key={index} className="flex mb-6 relative">
              {/* Vertical line */}
              {index < statuses.length - 1 && (
                <div
                  className={`absolute left-[12px] top-[24px] w-0.5 h-[calc(100%-12px)] ${
                    item.completed ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}

              {/* Status icon */}
              <div
                className={`z-10 flex items-center justify-center w-6 h-6 rounded-full mr-3 ${
                  item.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {item.icon}
              </div>

              {/* Status details */}
              <div className="flex-1">
                <div className="font-medium">{item.status}</div>
                {item.date ? (
                  <div className="text-sm text-muted-foreground">{formatDateTime(item.date)}</div>
                ) : (
                  <div className="text-sm text-muted-foreground">Pending</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Gatepass Details: {gatepass.requestNumber}</span>
            <StatusBadge status={gatepass.status} />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="images">Status Images</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Item Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Package className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Item Name</div>
                      <div>{gatepass.itemName}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-6"></div>
                    <div>
                      <div className="font-medium">Item ID</div>
                      <div>{gatepass.itemId}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-6"></div>
                    <div>
                      <div className="font-medium">Type</div>
                      <div>{gatepass.itemType}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-6"></div>
                    <div>
                      <div className="font-medium">Quantity</div>
                      <div>{gatepass.quantity}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <h3 className="text-lg font-medium">Request Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Request Date</div>
                      <div>{formatDate(gatepass.requestDate)}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-6"></div>
                    <div>
                      <div className="font-medium">Expected Return</div>
                      <div>
                        {gatepass.expectedReturnDate ? formatDate(gatepass.expectedReturnDate) : 'Not specified'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-6"></div>
                    <div>
                      <div className="font-medium">Actual Return</div>
                      <div>
                        {gatepass.actualReturnDate ? formatDate(gatepass.actualReturnDate) : 'Not returned yet'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Requestor Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Name</div>
                      <div>{gatepass.requestor.name}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-6"></div>
                    <div>
                      <div className="font-medium">Department</div>
                      <div>{gatepass.requestor.department}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-6"></div>
                    <div>
                      <div className="font-medium">Contact</div>
                      <div>{gatepass.requestor.contactNumber}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <h3 className="text-lg font-medium">Additional Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Destination</div>
                      <div>{gatepass.destination}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Reason</div>
                      <div>{gatepass.reason}</div>
                    </div>
                  </div>

                  {gatepass.notes && (
                    <div className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Notes</div>
                        <div>{gatepass.notes}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            {renderStatusTimeline()}

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Approval Information</h3>
              {gatepass.approver ? (
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Approved By</div>
                      <div>{gatepass.approver.name}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">Pending approval</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status Images</h3>
              {gatepass.statusImages.length === 0 ? (
                <div className="text-muted-foreground">No status images available</div>
              ) : (
                <ImageGallery
                  images={gatepass.statusImages}
                  onImageClick={handleImageClick}
                  selectedImage={selectedImage}
                  onCloseImageModal={handleCloseImageModal}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="attachments">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Attachments</h3>
              {gatepass.attachments.length === 0 ? (
                <div className="text-muted-foreground">No attachments available</div>
              ) : (
                <div className="space-y-3">
                  {gatepass.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center p-3 border rounded-md">
                      <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{attachment.fileName}</div>
                        <div className="text-sm text-muted-foreground">
                          {(attachment.fileSize / 1024).toFixed(2)} KB • Uploaded on {formatDate(attachment.uploadDate)}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

