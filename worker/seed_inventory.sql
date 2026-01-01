-- Insert Suppliers
INSERT OR IGNORE INTO suppliers (name, supplier_code, email) VALUES 
('Electrical Supplies Co', 'BS001', 'electrical@example.com'),
('Best Electronics', 'BE001', 'best@example.com'),
('Hardware Solutions', 'HS001', 'hardware@example.com');

-- Insert Stock Items
-- Adjusted columns: quantity -> current_stock. Removed total_value.
INSERT OR IGNORE INTO stock_items (stock_code, description, uom, current_stock, unit_price) VALUES 
('EP0001', 'PVC INSULATION TAPE (ELECTRICAL)', 'PCS', 100, 23.99),
('BN0013', '1"X 5" M/S BOLT & NUT', 'PCS', 44, 5.76);

-- Insert Purchase Orders (Mocking history)
-- EP0001 History
INSERT OR IGNORE INTO purchase_orders (po_number, supplier_id, order_date, created_by_id, status) 
VALUES 
('PO-240101', (SELECT id FROM suppliers WHERE name='Electrical Supplies Co'), '2024-01-01', 1, 'COMPLETED'),
('PO-231201', (SELECT id FROM suppliers WHERE name='Electrical Supplies Co'), '2023-12-01', 1, 'COMPLETED'),
('PO-231101', (SELECT id FROM suppliers WHERE name='Best Electronics'), '2023-11-01', 1, 'COMPLETED'),
('PO-231215', (SELECT id FROM suppliers WHERE name='Hardware Solutions'), '2023-12-15', 1, 'COMPLETED');

-- Insert PO Items (Linking mock history)
INSERT OR IGNORE INTO po_items (po_id, stock_code, description, quantity, uom, unit_price, total_price)
VALUES
-- EP0001 History Items
((SELECT id FROM purchase_orders WHERE po_number='PO-240101'), 'EP0001', 'PVC INSULATION TAPE (ELECTRICAL)', 10, 'PCS', 23.99, 239.90),
((SELECT id FROM purchase_orders WHERE po_number='PO-231201'), 'EP0001', 'PVC INSULATION TAPE (ELECTRICAL)', 10, 'PCS', 22.50, 225.00),
((SELECT id FROM purchase_orders WHERE po_number='PO-231101'), 'EP0001', 'PVC INSULATION TAPE (ELECTRICAL)', 10, 'PCS', 21.99, 219.90),
-- BN0013 History Items
((SELECT id FROM purchase_orders WHERE po_number='PO-240101'), 'BN0013', '1"X 5" M/S BOLT & NUT', 10, 'PCS', 5.76, 57.60),
((SELECT id FROM purchase_orders WHERE po_number='PO-231215'), 'BN0013', '1"X 5" M/S BOLT & NUT', 10, 'PCS', 5.50, 55.00);
