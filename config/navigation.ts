import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconPackages,
  IconHelp,
  IconAd2,
  IconReport,
  IconSearch,
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
    },
    {
      title: 'Inventory',
      url: '/inventory',
      icon: IconBuildingWarehouse
    },
    {
      title: 'Item Groups',
      url: '/inventory/item-groups',
      icon: IconPackages
    },
    {
      title: 'Suppliers',
      url: '/inventory/suppliers',
      icon: IconBuildingStore
    },
    {
      title: 'Stock Balance',
      url: '/inventory/stock-balance',
      icon: IconAd2
    },
    {
      title: 'Stock Ledgers',
      url: '/inventory/stock-ledger',
      icon: IconAd2
    },
    {
      title: 'UOM',
      url: '/inventory/uom',
      icon: IconBuildingWarehouse
    },
    {
      title: 'Machine',
      url: '/inventory/machine',
      icon: IconBuildingFactory2
    }
  ],
  navClouds: [],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: IconSettings
    },
    {
      title: 'Get Help',
      url: '/help',
      icon: IconHelp
    },
    {
      title: 'Search',
      url: '/search',
      icon: IconSearch
    }
  ],
  documents: [
    {
      name: 'Data Library',
      url: '/data-library',
      icon: IconDatabase
    },
    {
      name: 'Reports',
      url: '/reports',
      icon: IconReport
    },
    {
      name: 'Word Assistant',
      url: '/word-assistant',
      icon: IconFileWord
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

  // 2. Check sidebar items (navMain)
  const mainItem = navigationConfig.navMain.find(
    (item) => item.url === pathname
  );
  if (mainItem) return mainItem.title;

  // 3. Check secondary items
  const secondaryItem = navigationConfig.navSecondary.find(
    (item) => item.url === pathname
  );
  if (secondaryItem) return secondaryItem.title;

  // 4. Check documents
  const docItem = navigationConfig.documents.find(
    (item) => item.url === pathname
  );
  if (docItem) return docItem.name;

  //   // 5. Handle dynamic/nested routes
  //   if (pathname.startsWith('/purchase-requisition/')) {
  //     // If it's not 'create' (checked in step 1), it must be details
  //     return 'Purchase Requisition Details';
  //   }

  return 'Harvy ERP System';
}
