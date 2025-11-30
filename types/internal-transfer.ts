export type CompanyId = 'HAVYS_OIL' | 'GREEN_PLANT' | 'PARAMOUNT' | 'PLACEHOLDER'

export interface Company {
  id: CompanyId
  name: string
  description: string
  icon: 'building' | 'leaf' | 'cog' | 'settings'
}

export type TransferStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'shipped' | 'received' | 'cancelled'

export interface TransferItem {
  itemCode: string
  description: string
  quantity: number
  uom: string
}

export interface InternalTransfer {
  id: string
  requestNumber: string
  fromCompany: CompanyId
  toCompany: CompanyId
  requestDate: string
  status: TransferStatus
  items: TransferItem[]
  notes?: string
  approvedBy?: string
  approvedDate?: string
  rejectedBy?: string
  rejectionReason?: string
  shippedBy?: string
  shippedDate?: string
  receivedBy?: string
  receivedDate?: string
}

