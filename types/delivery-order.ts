export type DeliveryOrderStatus = "pending" | "in-transit" | "delivered" | "cancelled"

export interface DeliveryOrderItem {
  code: string
  name: string
  quantity: number
  uom: string
}

export interface DeliveryOrderSupplier {
  id: string
  name: string
  contact: string
}

export interface DeliveryOrder {
  id: string
  poReference: string
  supplier: DeliveryOrderSupplier
  expectedArrival: string
  actualArrival?: string
  status: DeliveryOrderStatus
  items: DeliveryOrderItem[]
  notes?: string
  createdAt: string
  updatedAt: string
}

