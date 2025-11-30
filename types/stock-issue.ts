export interface StockIssueItem {
  id: number
  stockCode: string
  description: string
  quantity: string | number
  uom: string
}

export interface StockIssue {
  id: string
  issueNumber: string
  issueDate: string
  issueTo: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  items: StockIssueItem[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

