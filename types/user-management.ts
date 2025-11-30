export type Role = "GENERAL_MANAGER" | "HR" | "STAFF"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department?: string
  avatarUrl?: string | null
  createdAt: string
  updatedAt: string
}

