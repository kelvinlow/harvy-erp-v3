'use client';

import * as React from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(value || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload the file to a server here
    // For now, we'll just create a local object URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange(url);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />

      {previewUrl ? (
        <div className="relative w-full max-w-xs">
          <img
            src={previewUrl || '/placeholder.svg'}
            alt="Machine"
            className="w-full h-auto rounded-md object-cover border"
          />
          <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemoveImage}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-md p-8 w-full max-w-xs flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={handleButtonClick}
        >
          <Camera className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">Click to upload machine image</p>
        </div>
      )}
    </div>
  );
}

