export interface Machine {
  id: string
  seqNo: number
  machineCode: string
  machineName: string
  serialNumber: string
  purchaseDate: string
  location: string
  processCode: string

  // New fields
  warrantyStartDate?: string
  warrantyEndDate?: string
  imageUrl?: string
  primaryContactName?: string
  primaryContactEmail?: string
  primaryContactPhone?: string
  nextServiceDate?: string

  createdAt: string
  updatedAt: string
}

export interface ServiceRecord {
  id: string
  machineId: string
  serviceDate: string
  description: string
  performedBy: string
  cost: number
  notes?: string
  createdAt: string
}

