export interface StockBalanceItem {
  id: string
  itemCode: string
  itemName: string
  itemGroup: string
  location: string
  uom: string
  currentStock: number
  reorderLevel: number
  maxLevel: number
  valueInStock: number
  lastUpdated: string
}

