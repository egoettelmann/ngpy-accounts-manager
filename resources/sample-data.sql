-- Users
INSERT INTO "user" (id, login, password)
VALUES (1, 'user', '$2y$10$pG.BKaPOQ7ACUQoqh3FA9OChMDinS6PrJW/PqE/uRdV3ESxvcLNKC');

-- Accounts
INSERT INTO "accounts" (id, name, description, color)
VALUES (1, 'account_1', 'Demo Account 1', '#4444FF');

-- Transactions
INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (1, 1, '2018-01-01', '2018-01-01', '2018-01-01', 'Demo Transaction 1', 'ABCDEF1', 10);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (2, 1, '2018-01-01', '2018-01-01', '2018-01-01', 'Demo Transaction 2', 'ABCDEF2', -5);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (3, 1, '2018-01-02', '2018-01-02', '2018-01-02', 'Demo Transaction 3', 'ABCDEF3', -14.5);
