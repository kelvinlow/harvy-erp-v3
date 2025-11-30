import type { ItemGroup } from '@/types/item-group';
import { mockStocks } from './mock-stocks';

export const mockItemGroups: ItemGroup[] = [
  {
    id: 'G1001',
    name: 'Electrical Components',
    description: 'All electrical parts and components',
    items: [mockStocks[0]], // Assuming first item is electrical
  },
  {
    id: 'G1002',
    name: 'Mechanical Parts',
    description: 'Mechanical components and hardware',
    items: [mockStocks[1], mockStocks[2]], // Assuming these are mechanical items
  },
  {
    id: 'G1003',
    name: 'Safety Equipment',
    description: 'Personal protective equipment and safety gear',
    items: [],
  },
];

