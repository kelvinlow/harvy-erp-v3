import type { Metadata } from 'next';
import { CompanySelector } from '@/components/internal-transfer/company-selector';

export const metadata: Metadata = {
  title: 'Create Internal Transfer',
  description: 'Create a new internal transfer request',
};

export default function CreateInternalTransferPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Create Internal Transfer</h1>
        <p className="text-muted-foreground">Select a company to request items from</p>
      </div>
      <CompanySelector />
    </div>
  );
}

