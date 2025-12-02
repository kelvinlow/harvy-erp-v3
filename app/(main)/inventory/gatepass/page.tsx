import { Suspense } from 'react';
import GatepassManagement from '@/components/inventory/gatepass/gatepass-management';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Gatepass - Harvy' };

export default function GatepassPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Gatepass Management</CardTitle>
              <CardDescription>
                Track and manage items and machinery moving in and out of
                designated areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading gatepass data...</div>}>
                <GatepassManagement />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
