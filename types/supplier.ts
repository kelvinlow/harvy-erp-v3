export interface SupplierProduct {
  itemId: string
  price: number
  minOrderQty: number
  leadTime: number
  notes?: string
  lastUpdated?: string
}

export interface Supplier {
  id: string
  name: string
  logoUrl?: string | null
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  notes?: string
  status: "active" | "inactive"
  products: SupplierProduct[]
}

