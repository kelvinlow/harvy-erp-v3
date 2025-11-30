import type { Stock } from "./stock"

export interface ItemGroup {
  id: string
  name: string
  description: string
  items: Stock[]
}

