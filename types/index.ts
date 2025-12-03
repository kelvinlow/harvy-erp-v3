export interface PurchaseRequisition {
  id?: string;
  company: string;
  date: string;
  employeeNo?: string;
  employeeName?: string;
  referenceNo?: string;
  supplierName?: string;
  supplierNo?: string;
  requisitionOrder?: string;
  items: PurchaseRequisitionItem[];
  remarks?: string;
  taxAmount: number;
  total: number;
  subTotal: number;
  orderedBy: {
    name: string;
    date: string;
  };
  seenBy: {
    name: string;
    date: string;
  };
  authorizedBy: {
    name: string;
    date: string;
  };
}

export interface PurchaseRequisitionItem {
  id: string;
  stockCode: string;
  description: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  discount: number;
  subAmount: number;
  taxCode: string;
  taxRate: number;
  station: string;
  totalAmount: number;
}

export interface PurchaseOrderItem {
  id: string;
  stockCode: string;
  description?: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  discount?: number;
  subAmount?: number;
  taxCode?: string;
  taxRate?: number;
  station?: string;
  amount: number;
}

export interface PurchaseOrder {
  id: string;
  date: string;
  poNumber: string;
  prNumber?: string;
  supplierName?: string;
  status: string;
  items: PurchaseOrderItem[];
  total: number;
  remarks?: string;
}
