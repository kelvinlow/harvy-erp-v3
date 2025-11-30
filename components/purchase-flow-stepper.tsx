'use client';

import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  FileText,
  ShoppingCart,
  Truck,
  CreditCard,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type PurchaseStatus =
  | 'REQUISITION_RAISED'
  | 'MANAGER_APPROVAL_1'
  | 'QUOTATION'
  | 'MANAGER_APPROVAL_2'
  | 'PURCHASE_ORDER'
  | 'MANAGER_APPROVAL_3'
  | 'DELIVERY_ORDER'
  | 'INVOICE_RECEIVED';

interface PurchaseFlowStepperProps {
  currentStatus: PurchaseStatus;
  className?: string;
}

interface Step {
  id: PurchaseStatus;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export function PurchaseFlowStepper({
  currentStatus,
  className
}: PurchaseFlowStepperProps) {
  const steps: Step[] = [
    {
      id: 'REQUISITION_RAISED',
      name: 'Purchase Requisition Raised',
      description: 'Initial requisition created',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'MANAGER_APPROVAL_1',
      name: 'Manager Approval',
      description: 'First approval step',
      icon: <ClipboardCheck className="h-5 w-5" />
    },
    {
      id: 'QUOTATION',
      name: 'Quotation',
      description: 'Gathering quotations',
      icon: <Clock className="h-5 w-5" />
    },
    {
      id: 'MANAGER_APPROVAL_2',
      name: 'Manager Approval',
      description: 'Second approval step',
      icon: <ClipboardCheck className="h-5 w-5" />
    },
    {
      id: 'PURCHASE_ORDER',
      name: 'Purchase Order Generation',
      description: 'Creating purchase order',
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      id: 'MANAGER_APPROVAL_3',
      name: 'Manager Approval',
      description: 'Final approval step',
      icon: <ClipboardCheck className="h-5 w-5" />
    },
    {
      id: 'DELIVERY_ORDER',
      name: 'Delivery Order',
      description: 'Order delivered',
      icon: <Truck className="h-5 w-5" />
    },
    {
      id: 'INVOICE_RECEIVED',
      name: 'Invoice Received',
      description: 'Invoice processing',
      icon: <CreditCard className="h-5 w-5" />
    }
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStatus);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollContainerRef}
      className={cn(
        'w-full overflow-x-auto pb-4 select-none cursor-grab active:cursor-grabbing no-scrollbar',
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <div className="flex items-start px-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step indicator */}
            <div className="relative flex shrink-0 flex-col items-center group">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-200',
                  index < currentStepIndex
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : index === currentStepIndex
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-400'
                )}
              >
                {index < currentStepIndex ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="mt-2 text-center px-1">
                <div
                  className={cn(
                    'text-sm font-medium leading-tight',
                    index <= currentStepIndex
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  )}
                >
                  {step.name}
                </div>
                <div className="mt-1 text-xs text-gray-500 leading-tight">
                  {step.description}
                </div>
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex shrink-0 px-1 mt-[18px]">
                <div
                  className={cn(
                    'h-1 w-9 rounded-full',
                    index < currentStepIndex
                      ? 'bg-green-500'
                      : index === currentStepIndex
                      ? 'bg-gradient-to-r from-blue-500 to-gray-200'
                      : 'bg-gray-200'
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
