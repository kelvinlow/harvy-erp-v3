import {
  sqliteTable,
  text,
  integer,
  real,
  index
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users Table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  role: text('role', { enum: ['admin', 'user', 'manager'] })
    .notNull()
    .default('user'),
  department: text('department'),
  status: text('status', { enum: ['active', 'inactive', 'suspended'] })
    .notNull()
    .default('active'),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Sessions Table (for auth)
export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    userAgent: text('user_agent'),
    ipAddress: text('ip_address'),
    lastActivityAt: integer('last_activity_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    ),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    )
  },
  (table) => ({
    userIdIdx: index('sessions_user_id_idx').on(table.userId),
    expiresAtIdx: index('sessions_expires_at_idx').on(table.expiresAt)
  })
);

// Stock Items Table
export const stockItems = sqliteTable(
  'stock_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    stockCode: text('stock_code').notNull().unique(),
    description: text('description').notNull(),
    category: text('category'),
    uom: text('uom').notNull(),
    currentStock: real('current_stock').notNull().default(0),
    unitPrice: real('unit_price').notNull().default(0),
    minStockLevel: real('min_stock_level').default(0),
    maxStockLevel: real('max_stock_level'),
    location: text('location'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    ),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    )
  },
  (table) => ({
    categoryIdx: index('stock_items_category_idx').on(table.category)
  })
);

// Suppliers Table
export const suppliers = sqliteTable('suppliers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  supplierCode: text('supplier_code').notNull().unique(),
  name: text('name').notNull(),
  contactPerson: text('contact_person'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  paymentTerms: text('payment_terms'),
  status: text('status', { enum: ['active', 'inactive'] })
    .notNull()
    .default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Purchase Requisitions Table
export const purchaseRequisitions = sqliteTable(
  'purchase_requisitions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    prNumber: text('pr_number').notNull().unique(),
    title: text('title').notNull(),
    status: text('status', {
      enum: [
        'DRAFT',
        'PENDING',
        'MANAGER_APPROVAL',
        'APPROVED',
        'PARTIAL',
        'REJECTED',
        'CANCELLED',
        'COMPLETED'
      ]
    })
      .notNull()
      .default('DRAFT'),
    requestedById: integer('requested_by_id')
      .notNull()
      .references(() => users.id),
    department: text('department').notNull(),
    company: text('company').notNull(),
    urgency: text('urgency', { enum: ['Low', 'Medium', 'High', 'Critical'] })
      .notNull()
      .default('Medium'),
    employeeNo: text('employee_no'),
    employeeName: text('employee_name'),
    referenceNo: text('reference_no'),
    departmentCode: text('department_code'),
    totalAmount: real('total_amount').notNull().default(0),
    currency: text('currency').notNull().default('MYR'),
    notes: text('notes'),
    approvedById: integer('approved_by_id').references(() => users.id),
    approvedAt: integer('approved_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    ),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    )
  },
  (table) => ({
    statusIdx: index('purchase_requisitions_status_idx').on(table.status),
    requestedByIdx: index('purchase_requisitions_requested_by_idx').on(
      table.requestedById
    )
  })
);

// PR Items Table
export const prItems = sqliteTable('pr_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  prId: integer('pr_id')
    .notNull()
    .references(() => purchaseRequisitions.id, { onDelete: 'cascade' }),
  stockCode: text('stock_code').notNull(),
  description: text('description').notNull(),
  quantity: real('quantity').notNull(),
  uom: text('uom').notNull(),
  unitPrice: real('unit_price').notNull(),
  discount: real('discount').default(0),
  taxCode: text('tax_code'),
  taxRate: real('tax_rate').default(0),
  totalPrice: real('total_price').notNull(),
  station: text('station'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Purchase Orders Table
export const purchaseOrders = sqliteTable(
  'purchase_orders',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    poNumber: text('po_number').notNull().unique(),
    prId: integer('pr_id').references(() => purchaseRequisitions.id),
    supplierId: integer('supplier_id')
      .notNull()
      .references(() => suppliers.id),
    status: text('status', {
      enum: [
        'DRAFT',
        'PENDING',
        'APPROVED',
        'SENT',
        'PARTIAL',
        'COMPLETED',
        'CANCELLED'
      ]
    })
      .notNull()
      .default('DRAFT'),
    orderDate: integer('order_date', { mode: 'timestamp' }),
    expectedDeliveryDate: integer('expected_delivery_date', {
      mode: 'timestamp'
    }),
    totalAmount: real('total_amount').notNull().default(0),
    currency: text('currency').notNull().default('MYR'),
    paymentTerms: text('payment_terms'),
    remarks: text('remarks'),
    createdById: integer('created_by_id')
      .notNull()
      .references(() => users.id),
    approvedById: integer('approved_by_id').references(() => users.id),
    approvedAt: integer('approved_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    ),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    )
  },
  (table) => ({
    statusIdx: index('purchase_orders_status_idx').on(table.status),
    supplierIdx: index('purchase_orders_supplier_idx').on(table.supplierId)
  })
);

// PO Items Table
export const poItems = sqliteTable('po_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  poId: integer('po_id')
    .notNull()
    .references(() => purchaseOrders.id, { onDelete: 'cascade' }),
  stockCode: text('stock_code').notNull(),
  description: text('description').notNull(),
  quantity: real('quantity').notNull(),
  receivedQuantity: real('received_quantity').default(0),
  uom: text('uom').notNull(),
  unitPrice: real('unit_price').notNull(),
  discount: real('discount').default(0),
  taxCode: text('tax_code'),
  taxRate: real('tax_rate').default(0),
  totalPrice: real('total_price').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Stock Movements Table (for tracking stock in/out)
export const stockMovements = sqliteTable(
  'stock_movements',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    stockItemId: integer('stock_item_id')
      .notNull()
      .references(() => stockItems.id),
    movementType: text('movement_type', {
      enum: ['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER', 'RETURN']
    }).notNull(),
    quantity: real('quantity').notNull(),
    balanceBefore: real('balance_before').notNull(),
    balanceAfter: real('balance_after').notNull(),
    referenceType: text('reference_type'), // 'PO', 'GRN', 'ISSUE', 'TRANSFER'
    referenceId: integer('reference_id'),
    remarks: text('remarks'),
    createdById: integer('created_by_id')
      .notNull()
      .references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    )
  },
  (table) => ({
    stockItemIdx: index('stock_movements_stock_item_idx').on(table.stockItemId),
    movementTypeIdx: index('stock_movements_type_idx').on(table.movementType)
  })
);

// Attachments Table
export const attachments = sqliteTable('attachments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fileName: text('file_name').notNull(),
  fileKey: text('file_key').notNull().unique(), // R2 object key
  fileSize: integer('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
  uploadedById: integer('uploaded_by_id')
    .notNull()
    .references(() => users.id),
  relatedType: text('related_type'), // 'PR', 'PO', 'GRN', etc.
  relatedId: integer('related_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Goods Received Notes Table
export const goodsReceivedNotes = sqliteTable('goods_received_notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  grnNumber: text('grn_number').notNull().unique(),
  poId: integer('po_id')
    .notNull()
    .references(() => purchaseOrders.id),
  supplierId: integer('supplier_id')
    .notNull()
    .references(() => suppliers.id),
  receivedDate: integer('received_date', { mode: 'timestamp' }).notNull(),
  deliveryOrderNo: text('delivery_order_no'),
  invoiceNo: text('invoice_no'),
  status: text('status', { enum: ['DRAFT', 'COMPLETED', 'CANCELLED'] })
    .notNull()
    .default('DRAFT'),
  remarks: text('remarks'),
  receivedById: integer('received_by_id')
    .notNull()
    .references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// GRN Items Table
export const grnItems = sqliteTable('grn_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  grnId: integer('grn_id')
    .notNull()
    .references(() => goodsReceivedNotes.id, { onDelete: 'cascade' }),
  poItemId: integer('po_item_id').references(() => poItems.id),
  stockCode: text('stock_code').notNull(),
  description: text('description').notNull(),
  orderedQuantity: real('ordered_quantity').notNull(),
  receivedQuantity: real('received_quantity').notNull(),
  uom: text('uom').notNull(),
  remarks: text('remarks'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Internal Transfers Table
export const internalTransfers = sqliteTable('internal_transfers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  transferNumber: text('transfer_number').notNull().unique(),
  fromLocation: text('from_location').notNull(),
  toLocation: text('to_location').notNull(),
  status: text('status', {
    enum: ['DRAFT', 'PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED']
  })
    .notNull()
    .default('DRAFT'),
  requestedById: integer('requested_by_id')
    .notNull()
    .references(() => users.id),
  approvedById: integer('approved_by_id').references(() => users.id),
  remarks: text('remarks'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Transfer Items Table
export const transferItems = sqliteTable('transfer_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  transferId: integer('transfer_id')
    .notNull()
    .references(() => internalTransfers.id, { onDelete: 'cascade' }),
  stockItemId: integer('stock_item_id')
    .notNull()
    .references(() => stockItems.id),
  quantity: real('quantity').notNull(),
  receivedQuantity: real('received_quantity').default(0),
  remarks: text('remarks'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Type exports for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type StockItem = typeof stockItems.$inferSelect;
export type NewStockItem = typeof stockItems.$inferInsert;

export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;

export type PurchaseRequisition = typeof purchaseRequisitions.$inferSelect;
export type NewPurchaseRequisition = typeof purchaseRequisitions.$inferInsert;

export type PRItem = typeof prItems.$inferSelect;
export type NewPRItem = typeof prItems.$inferInsert;

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert;

export type POItem = typeof poItems.$inferSelect;
export type NewPOItem = typeof poItems.$inferInsert;

export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;

export type GoodsReceivedNote = typeof goodsReceivedNotes.$inferSelect;
export type NewGoodsReceivedNote = typeof goodsReceivedNotes.$inferInsert;

export type GRNItem = typeof grnItems.$inferSelect;
export type NewGRNItem = typeof grnItems.$inferInsert;

export type InternalTransfer = typeof internalTransfers.$inferSelect;
export type NewInternalTransfer = typeof internalTransfers.$inferInsert;

export type TransferItem = typeof transferItems.$inferSelect;
export type NewTransferItem = typeof transferItems.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

// Units of Measure Table
export const unitsOfMeasure = sqliteTable('units_of_measure', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  description: text('description').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

export type UOM = typeof unitsOfMeasure.$inferSelect;
export type NewUOM = typeof unitsOfMeasure.$inferInsert;

// Staff Table
export const staff = sqliteTable('staff', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  staffId: text('staff_id').notNull().unique(), // e.g. ST1001
  fullName: text('full_name').notNull(),
  nric: text('nric'),
  email: text('email'),
  position: text('position'),
  department: text('department'),
  managerStaffId: text('manager_staff_id'), // References staffId
  phone: text('phone'),
  photoUrl: text('photo_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;
