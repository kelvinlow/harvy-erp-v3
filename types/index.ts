export interface PurchaseRequisition {
  id?: string
  company: string
  date: string
  employeeNo?: string
  employeeName?: string
  referenceNo?: string
  items: PurchaseRequisitionItem[]
  remarks?: string
}

export interface PurchaseRequisitionItem {
  id: string
  stockCode: string
  description: string
  quantity: number
  uom: string
  unitPrice: number
  discount: number
  subAmount: number
  taxCode: string
  taxRate: number
  station: string
  totalAmount: number
}

