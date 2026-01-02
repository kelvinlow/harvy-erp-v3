-- Seed User John Doe
INSERT OR IGNORE INTO users (email, name, password_hash, role, status)
VALUES ('johndoe@example.com', 'John Doe', 'hashed_password', 'user', 'active');

-- Seed PR
INSERT OR IGNORE INTO purchase_requisitions (
    pr_number, 
    title, 
    status, 
    requested_by_id, 
    department, 
    company, 
    urgency, 
    total_amount, 
    currency, 
    notes,
    created_at
)
SELECT 
    'PR-2025-00001', 
    'Office Supplies Requisition', 
    'MANAGER_APPROVAL', 
    id, 
    'Administration', 
    'Nova Gadget House', 
    'Medium', 
    1250.75, 
    'USD', 
    'Required for the new office setup',
    1742031000 -- 2025-03-15 approx
FROM users WHERE email = 'johndoe@example.com';

-- Seed PR Items
INSERT OR IGNORE INTO pr_items (
    pr_id, 
    stock_code, 
    description, 
    quantity, 
    uom, 
    unit_price, 
    total_price
)
SELECT 
    id, 'A123', 'Office Desk', 5, 'EA', 150.0, 750.0 
FROM purchase_requisitions WHERE pr_number = 'PR-2025-00001';

INSERT OR IGNORE INTO pr_items (
    pr_id, 
    stock_code, 
    description, 
    quantity, 
    uom, 
    unit_price, 
    total_price
)
SELECT 
    id, 'B456', 'Office Chair', 5, 'EA', 85.5, 427.5
FROM purchase_requisitions WHERE pr_number = 'PR-2025-00001';

INSERT OR IGNORE INTO pr_items (
    pr_id, 
    stock_code, 
    description, 
    quantity, 
    uom, 
    unit_price, 
    total_price
)
SELECT 
    id, 'C789', 'Filing Cabinet', 2, 'EA', 36.75, 73.5
FROM purchase_requisitions WHERE pr_number = 'PR-2025-00001';

-- Seed Attachments
INSERT OR IGNORE INTO attachments (
    file_name, 
    file_key, 
    file_size, 
    mime_type, 
    uploaded_by_id, 
    related_type, 
    related_id,
    created_at
)
SELECT 
    'Requirements.pdf', 'path/to/requirements.pdf', 1258291, 'application/pdf', 
    u.id, 
    'PR', 
    pr.id,
    1742031000
FROM users u, purchase_requisitions pr 
WHERE u.email = 'johndoe@example.com' AND pr.pr_number = 'PR-2025-00001';
