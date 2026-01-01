-- Seed Admin User
INSERT OR IGNORE INTO users (email, name, password_hash, role, status) 
VALUES ('lowshinsheng@gmail.com', 'Kelvin Low', '$2a$10$rZ9YvXqK5xQMP8ZL0V3.TH14NH39A7FR.sXQMP8ZL0V3.TH14NH39A', 'admin', 'active');

-- Seed UOMs
INSERT OR IGNORE INTO units_of_measure (code, description) VALUES 
('BAG', 'BAG'),
('BOT', 'BOTTLE'),
('BOX', 'BOX'),
('CAN', 'CAN'),
('CARBOY', 'CARBOY'),
('CART', 'CARTON'),
('COIL', 'COIL'),
('CYL', 'CYLINDER'),
('DAY', 'DAY'),
('DOZEN', 'DOZEN'),
('DRUM', 'DRUM'),
('FT', 'FEET'),
('GAL', 'GALLON'),
('INC', 'INCH'),
('JOB', 'JOB'),
('KG', 'KILOGRAMS'),
('KM', 'KILOMETERS'),
('LGTH', 'LENGTH'),
('LOT', 'LOT'),
('LTR', 'LITER'),
('MTR', 'METER'),
('NIGHT', 'NIGHT'),
('NO', 'NO'),
('PAD', 'PAD'),
('PAIL', 'PAIL'),
('PAIR', 'PAIR'),
('PAL', 'PALLET'),
('PCS', 'PIECES'),
('PERSON', 'PERSON'),
('PKT', 'PACKET'),
('POINT', 'POINT'),
('REAM', 'REAM'),
('ROLL', 'ROLL'),
('SET', 'SET'),
('SHEET', 'SHEET'),
('TIME', 'TIME'),
('TIN', 'TIN'),
('TON', 'TON'),
('TRIP', 'TRIP'),
('TUBE', 'TUBE'),
('UNIT', 'UNIT'),
('BDL', 'BUNDLE');

-- Seed Suppliers
INSERT OR IGNORE INTO suppliers (supplier_code, name, contact_person, email, phone, status) VALUES
('SUP001', 'ABC Chemicals Sdn Bhd', 'John Tan', 'john@abcchemicals.com', '03-1234567', 'active'),
('SUP002', 'XYZ Industrial Supply', 'Mary Lee', 'mary@xyzindustrial.com', '03-7654321', 'active');

-- Seed Stock Items
INSERT OR IGNORE INTO stock_items (stock_code, description, category, uom, current_stock, unit_price, min_stock_level, max_stock_level, location) VALUES
('EP0001', 'EPOXY RESIN 828', 'Chemicals', 'KG', 500.00, 25.50, 100.00, 1000.00, 'Warehouse A'),
('BN0013', 'BENZYL ALCOHOL', 'Chemicals', 'LTR', 200.00, 15.75, 50.00, 500.00, 'Warehouse B');

-- Seed Purchase Orders
INSERT OR IGNORE INTO purchase_orders (po_number, supplier_id, status, order_date, total_amount, currency, created_by_id) VALUES
('PO-2024-001', 1, 'COMPLETED', 1704067200, 12750.00, 'MYR', 1),
('PO-2024-002', 2, 'COMPLETED', 1706745600, 7875.00, 'MYR', 1),
('PO-2024-003', 1, 'COMPLETED', 1709251200, 13000.00, 'MYR', 1);

-- Seed PO Items (Price History)
INSERT OR IGNORE INTO po_items (po_id, stock_code, description, quantity, uom, unit_price, total_price) VALUES
-- PO-2024-001
(1, 'EP0001', 'EPOXY RESIN 828', 500.00, 'KG', 25.50, 12750.00),
-- PO-2024-002
(2, 'BN0013', 'BENZYL ALCOHOL', 500.00, 'LTR', 15.75, 7875.00),
-- PO-2024-003
(3, 'EP0001', 'EPOXY RESIN 828', 500.00, 'KG', 26.00, 13000.00);
