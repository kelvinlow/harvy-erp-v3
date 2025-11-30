export interface StockItem {
  id: string
  stockCode: string
  description: string
  cost: number
  station: string
  machineNo: string
  sicNo: string
  receivedBy: string
  uom: string
  quantity: number
}

export interface Stock {
  id: string
  code: string
  name: string
}

