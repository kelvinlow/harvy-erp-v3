import {
  IconUserBitcoin,
  IconDashboard,
  IconTransfer,
  IconDoorExit,
  IconRuler2,
  IconChartHistogram,
  IconPackages,
  IconTruckFilled,
  IconAd2,
  IconFilePercentFilled,
  IconFileLambdaFilled,
  IconSettings,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconBuildingFactory2
} from '@tabler/icons-react';

export const navigationConfig = {
  user: {
    name: 'Kelvin Low',
    email: 'kelvin.low@harvy.com.my',
    avatar: '/avatars/shadcn.jpg'
  },
  // Main Sidebar Navigation
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard
    }
  ],
  navPurchasing: [
    {
      name: 'Purchase Requisition',
      url: '/purchasing/purchase-requisition',
      icon: IconFilePercentFilled
    },
    {
      name: 'Purchase Order',
      url: '/purchasing/purchase-order',
      icon: IconFileLambdaFilled
    },
    {
      name: 'Delivery Order',
      url: '/purchasing/delivery-order',
      icon: IconTruckFilled
    },
    {
      name: 'Purchase Analytics',
      url: '/purchasing/purchase-analytics',
      icon: IconChartHistogram
    }
  ],
  navInventory: [
    {
      name: 'Inventory List',
      url: '/inventory',
      icon: IconBuildingWarehouse
    },
    {
      name: 'Item Groups',
      url: '/inventory/item-groups',
      icon: IconPackages
    },
    {
      name: 'UOM Master',
      url: '/inventory/uom',
      icon: IconRuler2
    },
    {
      name: 'Stock Balance',
      url: '/inventory/stock-balance',
      icon: IconAd2
    },
    {
      name: 'Stock Issue',
      url: '/inventory/stock-issue',
      icon: IconAd2
    },
    {
      name: 'Stock Adjustment',
      url: '/inventory/stock-adjustment',
      icon: IconAd2
    },
    {
      name: 'Stock Ledgers',
      url: '/inventory/stock-ledger',
      icon: IconAd2
    },
    {
      name: 'Suppliers',
      url: '/inventory/suppliers',
      icon: IconUserBitcoin
    },
    {
      name: 'Gatepass',
      url: '/inventory/gatepass',
      icon: IconDoorExit
    },
    {
      name: 'Internal Transfer',
      url: '/inventory/internal-transfer',
      icon: IconTransfer
    }
  ],
  navMachine: [
    {
      name: 'Machine',
      url: '/inventory/machine',
      icon: IconBuildingFactory2
    }
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: IconSettings
    }
  ],
  // Mapping for pages that are NOT in the sidebar
  // You can use regex patterns or exact paths
  pages: {
    '/purchase-requisition': 'Purchase Requisitions',
    '/purchase-requisition/create': 'Create Purchase Requisition'
    // Dynamic routes can be handled by logic, but we can map base paths here
  }
};

// Helper to find title by path
export function getPageTitle(pathname: string): string {
  // 1. Check exact matches in pages config
  if (navigationConfig.pages[pathname as keyof typeof navigationConfig.pages]) {
    return navigationConfig.pages[
      pathname as keyof typeof navigationConfig.pages
    ];
  }

  // 2. Search all navigation arrays dynamically
  for (const section of Object.values(navigationConfig)) {
    if (Array.isArray(section)) {
      const item = section.find((i) => i.url === pathname);
      if (item) {
        if ('title' in item) return item.title;
        if ('name' in item) return item.name;
      }
    }
  }

  return 'Harvy ERP System';
}
