-- Insert mock inventory items if they don't exist
INSERT OR IGNORE INTO stock_items (stock_code, description, uom, unit_price, category, current_stock) VALUES 
('A123', 'Widget A', 'EA', 10.0, 'Electronic', 100),
('B456', 'Gadget B', 'EA', 25.5, 'Mechanical', 50),
('C789', 'Thingamajig C', 'EA', 5.75, 'General', 200);
