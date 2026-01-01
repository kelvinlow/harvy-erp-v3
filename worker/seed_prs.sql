-- Insert Dummy Supplier
INSERT INTO suppliers (supplier_code, name, status) VALUES ('SUP001', 'Mock Supplier', 'active');

-- Insert PRs
INSERT INTO purchase_requisitions (id, pr_number, title, company, status, requested_by_id, department, urgency, total_amount, currency, created_at) VALUES 
(1, 'PR-2024-001', 'Requisition for PR001', 'HAVYS OIL MILL', 'PENDING', 1, 'Main', 'Medium', 0, 'MYR', 1704844800); -- 2024-01-10

INSERT INTO purchase_requisitions (id, pr_number, title, company, status, requested_by_id, department, urgency, total_amount, currency, created_at) VALUES 
(2, 'PR-2024-002', 'Requisition for PR002', 'GREEN PLANT', 'APPROVED', 1, 'Main', 'Medium', 0, 'MYR', 1705017600); -- 2024-01-12

INSERT INTO purchase_requisitions (id, pr_number, title, company, status, requested_by_id, department, urgency, total_amount, currency, created_at) VALUES 
(3, 'PR-2024-003', 'Requisition for PR003', 'HAVYS OIL MILL', 'REJECTED', 1, 'Main', 'Medium', 0, 'MYR', 1705276800); -- 2024-01-15

INSERT INTO purchase_requisitions (id, pr_number, title, company, status, requested_by_id, department, urgency, total_amount, currency, created_at) VALUES 
(4, 'PR-2024-004', 'Requisition for PR004', 'PARAMOUNT', 'COMPLETED', 1, 'Main', 'Medium', 0, 'MYR', 1705536000); -- 2024-01-18

INSERT INTO purchase_requisitions (id, pr_number, title, company, status, requested_by_id, department, urgency, total_amount, currency, created_at) VALUES 
(5, 'PR-2024-005', 'Requisition for PR005', 'HAVYS OIL MILL', 'MANAGER_APPROVAL', 1, 'Main', 'Medium', 0, 'MYR', 1705708800); -- 2024-01-20

-- Insert POs (linking to PRs)
INSERT INTO purchase_orders (po_number, pr_id, supplier_id, status, total_amount, currency, created_by_id)
VALUES ('PO-2024-001', 2, 1, 'APPROVED', 0, 'MYR', 1);

INSERT INTO purchase_orders (po_number, pr_id, supplier_id, status, total_amount, currency, created_by_id)
VALUES ('PO-2024-002', 4, 1, 'COMPLETED', 0, 'MYR', 1);
