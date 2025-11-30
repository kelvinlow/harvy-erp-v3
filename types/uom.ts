export interface UOMRelationship {
  id: string
  fromUOMId: string
  toUOMId: string
  conversionRate: number
  fromUOMCode?: string // For display purposes
  toUOMCode?: string // For display purposes
}

export interface UOM {
  id: string
  code: string
  description: string
  createdAt: string
  updatedAt: string
  relationships?: UOMRelationship[]
}

