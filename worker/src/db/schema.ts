import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('user'), // user, manager, admin
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Purchase Requisitions table
export const purchaseRequisitions = sqliteTable('purchase_requisitions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  prNumber: text('pr_number').notNull().unique(),
  title: text('title').notNull(),
  status: text('status').notNull().default('DRAFT'), // DRAFT, PENDING_APPROVAL, APPROVED, REJECTED
  requestedById: integer('requested_by_id')
    .notNull()
    .references(() => users.id),
  department: text('department').notNull(),
  company: text('company').notNull(),
  urgency: text('urgency').notNull().default('Medium'), // Low, Medium, High
  totalAmount: real('total_amount').notNull().default(0),
  currency: text('currency').notNull().default('MYR'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Purchase Requisition Items table
export const prItems = sqliteTable('pr_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  prId: integer('pr_id')
    .notNull()
    .references(() => purchaseRequisitions.id, { onDelete: 'cascade' }),
  stockCode: text('stock_code').notNull(),
  description: text('description').notNull(),
  quantity: real('quantity').notNull(),
  uom: text('uom').notNull(), // Unit of measurement
  unitPrice: real('unit_price').notNull(),
  totalPrice: real('total_price').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Stock Items table
export const stockItems = sqliteTable('stock_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  stockCode: text('stock_code').notNull().unique(),
  description: text('description').notNull(),
  category: text('category'),
  uom: text('uom').notNull(),
  currentStock: real('current_stock').notNull().default(0),
  unitPrice: real('unit_price').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Attachments/Files stored in R2
export const attachments = sqliteTable('attachments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fileName: text('file_name').notNull(),
  fileKey: text('file_key').notNull().unique(), // R2 object key
  fileSize: integer('file_size').notNull(), // in bytes
  mimeType: text('mime_type').notNull(),
  uploadedById: integer('uploaded_by_id')
    .notNull()
    .references(() => users.id),
  relatedType: text('related_type'), // 'purchase_requisition', 'purchase_order', etc.
  relatedId: integer('related_id'), // ID of the related entity
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  )
});

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type PurchaseRequisition = typeof purchaseRequisitions.$inferSelect;
export type NewPurchaseRequisition = typeof purchaseRequisitions.$inferInsert;

export type PRItem = typeof prItems.$inferSelect;
export type NewPRItem = typeof prItems.$inferInsert;

export type StockItem = typeof stockItems.$inferSelect;
export type NewStockItem = typeof stockItems.$inferInsert;

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;
