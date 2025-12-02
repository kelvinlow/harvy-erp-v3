import { Suspense } from 'react';
import GatepassManagement from '@/components/gatepass/gatepass-management';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GatepassPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gatepass Management</CardTitle>
          <CardDescription>Track and manage items and machinery moving in and out of designated areas</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading gatepass data...</div>}>
            <GatepassManagement />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

