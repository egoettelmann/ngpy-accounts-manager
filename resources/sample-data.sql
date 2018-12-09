-- Users
INSERT INTO "user" (id, login, password)
VALUES (1, 'user', '$2y$10$pG.BKaPOQ7ACUQoqh3FA9OChMDinS6PrJW/PqE/uRdV3ESxvcLNKC');


-- Accounts
INSERT INTO "accounts" (id, name, description, color)
VALUES (1, 'account_1', 'Demo Account 1', '#4444FF');


-- Categories
INSERT INTO "categories" (id, name, "type")
VALUES (1, 'Category 1', 'D');

INSERT INTO "categories" (id, name, "type")
VALUES (2, 'Category 2', 'C');


-- Labels
INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (1, 'Label 1', '#4444FF', '', 1);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (2, 'Label 2', '#FF4444', '', 1);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (3, 'Label 3', '#44FF44', '', 2);


-- Transactions
INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (1, 1, '2018-01-01', '2018-01-01', '2018-01-01', 'Demo Transaction 1', 'ABCDEF1', 10);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (2, 1, '2018-01-01', '2018-01-01', '2018-01-01', 'Demo Transaction 2', 'ABCDEF2', -5);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (3, 1, '2018-01-02', '2018-01-02', '2018-01-02', 'Demo Transaction 3', 'ABCDEF3', -14.5);
