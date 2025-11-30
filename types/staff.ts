export interface Staff {
  id: string
  name: string
  email: string
  position: string
  department: string
  status: "active" | "suspended"
  phone?: string
  employeeId?: string
  notes?: string
  lastLogin: Date | null
}

