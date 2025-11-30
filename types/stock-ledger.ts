export interface StockTransaction {
  no: number
  transactionNo: string
  date: Date
  quantityIn: number
  quantityOut: number
  amountIn: number
  amountOut: number
}

export interface StockItem {
  code: string
  description: string
  openingBalance: {
    quantity: number
    amount: number
  }
  transactions: StockTransaction[]
}

