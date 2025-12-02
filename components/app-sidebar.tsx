'use client';

import * as React from 'react';
import { IconInnerShadowTop } from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import { NavDocuments } from '@/components/nav-documents';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigationConfig } from '@/config/navigation';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-gradient-to-br from-sky-50"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">HARVY</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <SidebarContent>
          <NavMain items={navigationConfig.navMain} />
          <NavDocuments
            items={navigationConfig.navPurchasing}
            label="Purchasing"
          />
          <NavDocuments
            items={navigationConfig.navInventory}
            label="Inventory"
          />
          <NavDocuments items={navigationConfig.navMachine} label="Machine" />
          <NavSecondary
            items={navigationConfig.navSecondary}
            className="mt-auto"
          />
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter>
        <NavUser user={navigationConfig.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
