-- Insert Suppliers if they don't exist
INSERT OR IGNORE INTO suppliers (supplier_code, name, status) VALUES 
('SUP002', 'ABC Hardware Supplies', 'active'),
('SUP003', 'XYZ Industrial Solutions', 'active'),
('SUP004', 'Global Parts Inc', 'active');

-- Clear existing POs and items for idempotency (optional, but good for testing)
-- DELETE FROM po_items;
-- DELETE FROM purchase_orders;

-- Insert POs
-- PO001 -> PO-2024-001, PR-2024-001 (id 1), ABC Hardware Supplies (SUP002)
-- Since ABC Hardware Supplies might have a different ID depending on order of insertion, 
-- I'll select the ID in the insert.

INSERT INTO purchase_orders (po_number, pr_id, supplier_id, status, total_amount, currency, created_by_id, order_date) 
SELECT 
  'PO-2024-001', 
  1, 
  id, 
  'PENDING', 
  3000, 
  'MYR', 
  1, 
  1705276800  -- 2024-01-15
FROM suppliers WHERE supplier_code = 'SUP002';

-- Get the ID of the newly inserted PO to insert items
INSERT INTO po_items (po_id, stock_code, description, quantity, uom, unit_price, total_price)
SELECT id, 'HW001', 'Power Tools Set', 2, 'SET', 1500, 3000
FROM purchase_orders WHERE po_number = 'PO-2024-001';


-- PO002 -> PO-2024-002, PR-2024-002 (id 2), XYZ Industrial Solutions (SUP003)
INSERT INTO purchase_orders (po_number, pr_id, supplier_id, status, total_amount, currency, created_by_id, order_date)
SELECT 
  'PO-2024-002', 
  2, 
  id, 
  'APPROVED', 
  5000, 
  'MYR', 
  1, 
  1705363200 -- 2024-01-16
FROM suppliers WHERE supplier_code = 'SUP003';

INSERT INTO po_items (po_id, stock_code, description, quantity, uom, unit_price, total_price)
SELECT id, 'MT001', 'Industrial Motor', 1, 'UNIT', 5000, 5000
FROM purchase_orders WHERE po_number = 'PO-2024-002';


-- PO003 -> PO-2024-003, PR-2024-003 (id 3), Global Parts Inc (SUP004)
INSERT INTO purchase_orders (po_number, pr_id, supplier_id, status, total_amount, currency, created_by_id, order_date)
SELECT 
  'PO-2024-003', 
  3, 
  id, 
  'COMPLETED', 
  4000, 
  'MYR', 
  1, 
  1705449600 -- 2024-01-17
FROM suppliers WHERE supplier_code = 'SUP004';

INSERT INTO po_items (po_id, stock_code, description, quantity, uom, unit_price, total_price)
SELECT id, 'SP001', 'Spare Parts Kit', 5, 'KIT', 800, 4000
FROM purchase_orders WHERE po_number = 'PO-2024-003';
