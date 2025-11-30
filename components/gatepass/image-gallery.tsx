'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { GatepassImage } from '@/types/gatepass';
import { formatDate } from '@/lib/utils';
import StatusBadge from './status-badge';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from 'lucide-react';

interface ImageGalleryProps {
  images: GatepassImage[]
  onImageClick: (image: GatepassImage) => void
  selectedImage: GatepassImage | null
  onCloseImageModal: () => void
}

export default function ImageGallery({ images, onImageClick, selectedImage, onCloseImageModal }: ImageGalleryProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleNext = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % images.length;
    onImageClick(images[nextIndex]);
  };

  const handlePrevious = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    onImageClick(images[prevIndex]);
  };

  const handleCloseModal = () => {
    setZoomLevel(1);
    onCloseImageModal();
  };

  // Group images by status
  const groupedImages: Record<string, GatepassImage[]> = {};
  images.forEach((image) => {
    if (!groupedImages[image.status]) {
      groupedImages[image.status] = [];
    }
    groupedImages[image.status].push(image);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedImages).map(([status, statusImages]) => (
        <div key={status} className="space-y-3">
          <div className="flex items-center">
            <h4 className="text-md font-medium">{status} Images</h4>
            <div className="ml-2">
              <StatusBadge status={status as any} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {statusImages.map((image) => (
              <div
                key={image.id}
                className="relative border rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onImageClick(image)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.thumbnailUrl || '/placeholder.svg'}
                    alt={`Status image for ${status}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2 text-xs text-muted-foreground">{formatDate(image.uploadDate)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Full-size image modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
          {selectedImage && (
            <div className="relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-background/80 rounded-full"
                onClick={handleCloseModal}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 rounded-full"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 rounded-full"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Zoom controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2 bg-background/50 p-2 rounded-full">
                <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm">{Math.round(zoomLevel * 100)}%</span>
                <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 3}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Image */}
              <div
                className="h-[80vh] w-full flex items-center justify-center overflow-auto"
                style={{ padding: zoomLevel > 1 ? '2rem' : '0' }}
              >
                <div
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  className="relative"
                >
                  <img
                    src={selectedImage.imageUrl || '/placeholder.svg'}
                    alt={selectedImage.description}
                    className="max-h-[80vh] max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Image details */}
              <div className="p-4 bg-background">
                <div className="flex items-center justify-between">
                  <div>
                    <StatusBadge status={selectedImage.status} />
                    <p className="mt-1 text-sm">{formatDate(selectedImage.uploadDate)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedImage.description}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

