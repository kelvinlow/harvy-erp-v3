export interface PurchaseAnalytics {
  supplierId: number
  supplierName: string
  monthlyData: {
    [key: string]: number // Format: "Apr 2024": 0.000
  }
}

export interface AnalyticsFilters {
  supplier: string
  purchaseInvoice: string
  value: string
  dateRange: {
    start: string
    end: string
  }
  view: 'monthly' | 'quarterly' | 'yearly'
}

