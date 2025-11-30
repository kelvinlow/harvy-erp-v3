import type { Supplier } from '@/types/supplier';

export const mockSuppliers: Supplier[] = [
  {
    id: 'S1001',
    name: 'ABC Industrial Supplies',
    logoUrl: '/placeholder.svg?height=128&width=128',
    contactPerson: 'John Smith',
    email: 'john.smith@abcindustrial.com',
    phone: '+60 12-345 6789',
    address: '123 Industrial Park,\nJalan Perindustrian 1,\n40000 Shah Alam,\nSelangor, Malaysia',
    website: 'https://www.abcindustrial.com',
    status: 'active',
    products: [
      {
        itemId: '1', // EP0001
        price: 22.5,
        minOrderQty: 10,
        leadTime: 3,
        lastUpdated: '2024-02-15T08:30:00Z',
      },
      {
        itemId: '3', // ST003
        price: 85.75,
        minOrderQty: 5,
        leadTime: 7,
        notes: 'Premium quality hydraulic oil',
        lastUpdated: '2024-02-15T08:30:00Z',
      },
    ],
  },
  {
    id: 'S1002',
    name: 'Global Hardware Solutions',
    logoUrl: '/placeholder.svg?height=128&width=128',
    contactPerson: 'Sarah Lee',
    email: 'sarah.lee@globalhardware.com',
    phone: '+60 13-456 7890',
    status: 'active',
    products: [
      {
        itemId: '2', // BN0013
        price: 5.25,
        minOrderQty: 50,
        leadTime: 2,
        lastUpdated: '2024-02-10T14:15:00Z',
      },
    ],
  },
  {
    id: 'S1003',
    name: 'Safety Equipment Providers',
    logoUrl: '/placeholder.svg?height=128&width=128',
    contactPerson: 'Michael Wong',
    email: 'michael.wong@safetyequip.com',
    phone: '+60 14-567 8901',
    website: 'https://www.safetyequip.com',
    status: 'active',
    products: [
      {
        itemId: '4', // ST004
        price: 35.0,
        minOrderQty: 10,
        leadTime: 5,
        notes: 'SIRIM certified safety helmets',
        lastUpdated: '2024-01-25T09:45:00Z',
      },
    ],
  },
  {
    id: 'S1004',
    name: 'Precision Tools Malaysia',
    logoUrl: '/placeholder.svg?height=128&width=128',
    contactPerson: 'David Tan',
    email: 'david.tan@precisiontools.my',
    phone: '+60 15-678 9012',
    address: '45 Jalan Teknologi,\nTaman Perindustrian Bukit Jalil,\n57000 Kuala Lumpur,\nMalaysia',
    status: 'inactive',
    products: [
      {
        itemId: '6', // ST006
        price: 125.5,
        minOrderQty: 2,
        leadTime: 14,
        notes: 'Japanese imported calipers',
        lastUpdated: '2023-12-05T11:20:00Z',
      },
    ],
  },
];

