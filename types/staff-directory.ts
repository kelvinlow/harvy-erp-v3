export interface StaffMember {
  id: string
  fullName: string
  nric: string
  email: string
  position: string
  department: string
  managerId: string | null
  phone?: string
  photoUrl?: string | null
}

