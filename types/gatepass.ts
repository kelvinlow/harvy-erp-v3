export type GatepassStatus = "Pending Approval" | "Approved" | "Out" | "Returned" | "Replaced"

export type GatepassType = "Item" | "Machinery" | "Equipment" | "Tool" | "Vehicle" | "Other"

export interface Attachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  url: string
}

export interface GatepassImage {
  id: string
  status: GatepassStatus
  imageUrl: string
  thumbnailUrl: string
  uploadDate: string
  description: string
}

export interface Gatepass {
  id: string
  requestNumber: string
  itemName: string
  itemId: string
  itemType: GatepassType
  quantity: number
  requestDate: string
  expectedReturnDate: string | null
  actualReturnDate: string | null
  requestor: {
    id: string
    name: string
    department: string
    contactNumber: string
  }
  approver: {
    id: string
    name: string
  } | null
  status: GatepassStatus
  reason: string
  destination: string
  notes: string
  attachments: Attachment[]
  statusImages: GatepassImage[]
  createdAt: string
  updatedAt: string
}

export interface GatepassFilterOptions {
  search: string
  status: GatepassStatus | "All"
  itemType: GatepassType | "All"
  dateRange: {
    from: string | null
    to: string | null
  }
  requestor: string
}

export interface GatepassSortOptions {
  field: keyof Gatepass | ""
  direction: "asc" | "desc"
}

