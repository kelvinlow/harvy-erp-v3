'use client';

import { useState } from 'react';
import type { StaffMember } from '@/types/staff-directory';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface OrgChartNodeProps {
  staff: StaffMember
  allStaff: StaffMember[]
  level: number
  expanded: Record<string, boolean>
  toggleExpand: (id: string) => void
  searchTerm: string
}

function OrgChartNode({ staff, allStaff, level, expanded, toggleExpand, searchTerm }: OrgChartNodeProps) {
  // Get direct reports
  const directReports = allStaff.filter((s) => s.managerId === staff.id);

  // Check if this node or any of its children match the search
  const matchesSearch =
    searchTerm === '' ||
    staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchTerm.toLowerCase());

  // Get initials from full name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!matchesSearch && searchTerm !== '') {
    // Check if any children match
    const childrenMatch = directReports.some((report) => {
      const checkChild = (s: StaffMember): boolean => {
        if (
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.position.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
        }

        const childReports = allStaff.filter((c) => c.managerId === s.id);
        return childReports.some(checkChild);
      };

      return checkChild(report);
    });

    if (!childrenMatch) return null;
  }

  return (
    <div className="relative">
      <div
        className={`flex items-start gap-4 p-4 rounded-md border ${
          level === 0 ? 'bg-primary/5 border-primary/20' : ''
        }`}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={staff.photoUrl || ''} alt={staff.fullName} />
          <AvatarFallback>{getInitials(staff.fullName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium truncate">{staff.fullName}</p>
              <p className="text-sm text-muted-foreground truncate">{staff.position}</p>
            </div>
            {directReports.length > 0 && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleExpand(staff.id)}>
                {expanded[staff.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {directReports.length > 0 && expanded[staff.id] && (
        <div className="ml-8 mt-2 pl-4 border-l">
          <div className="space-y-2">
            {directReports.map((report) => (
              <OrgChartNode
                key={report.id}
                staff={report}
                allStaff={allStaff}
                level={level + 1}
                expanded={expanded}
                toggleExpand={toggleExpand}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface OrganizationalChartProps {
  staff: StaffMember[]
}

export function OrganizationalChart({ staff }: OrganizationalChartProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Find top-level staff (those without managers)
  const topLevelStaff = staff.filter((s) => !s.managerId);

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Expand all
  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    staff.forEach((s) => {
      allExpanded[s.id] = true;
    });
    setExpanded(allExpanded);
  };

  // Collapse all
  const collapseAll = () => {
    setExpanded({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {topLevelStaff.length > 0 ? (
              topLevelStaff.map((topStaff) => (
                <OrgChartNode
                  key={topStaff.id}
                  staff={topStaff}
                  allStaff={staff}
                  level={0}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  searchTerm={searchTerm}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No staff members found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

