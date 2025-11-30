import type { PurchaseAnalytics } from '@/types/purchase-analytics';

export const mockPurchaseData: PurchaseAnalytics[] = [
  {
    supplierId: 1,
    supplierName: 'Annabell Dorot',
    monthlyData: {
      'Apr 2024': 0.0,
      'May 2024': 0.0,
      'Jun 2024': 0.0,
      'Jul 2024': 0.0,
      'Aug 2024': 0.0,
      'Sep 2024': 0.0,
      'Oct 2024': 0.0,
      'Nov 2024': 0.0,
      'Dec 2024': 0.0,
      'Jan 2025': 0.0,
      'Feb 2025': 0.0,
      'Mar 2025': 0.0,
    },
  },
  // Add more mock data entries...
];

export const generateMockData = () => {
  const suppliers = [
    'Annabell Dorot',
    'deswita grub',
    'tauram',
    'Toko perkasa jaya',
    'Bagas grup',
    'Ridho sedang ga',
    'putri',
    'rizki',
    'Baju muslim',
    'bapak-bapak lag',
  ];

  return suppliers.map((name, index) => ({
    supplierId: index + 1,
    supplierName: name,
    monthlyData: {
      'Apr 2024': 0.0,
      'May 2024': 0.0,
      'Jun 2024': 0.0,
      'Jul 2024': 0.0,
      'Aug 2024': 0.0,
      'Sep 2024': 0.0,
      'Oct 2024': 0.0,
      'Nov 2024': 0.0,
      'Dec 2024': 0.0,
      'Jan 2025': 0.0,
      'Feb 2025': 0.0,
      'Mar 2025': 0.0,
    },
  }));
};

