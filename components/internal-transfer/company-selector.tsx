'use client';

import { Building2, Leaf, Cog, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { companies } from '@/data/companies';
import { useRouter } from 'next/navigation';

const iconMap = {
  building: Building2,
  leaf: Leaf,
  cog: Cog,
  settings: Settings,
};

export function CompanySelector() {
  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {companies.map((company) => {
        const Icon = iconMap[company.icon];
        return (
          <Card
            key={company.id}
            className="p-6 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => router.push(`/internal-transfer/create/${company.id}`)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">{company.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{company.description}</p>
          </Card>
        );
      })}
    </div>
  );
}

