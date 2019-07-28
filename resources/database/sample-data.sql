-- Users
INSERT INTO "user" (id, login, password)
VALUES (1, 'user', '$2y$10$pG.BKaPOQ7ACUQoqh3FA9OChMDinS6PrJW/PqE/uRdV3ESxvcLNKC');


-- Accounts
INSERT INTO "accounts" (id, name, description, color)
VALUES (1, 'account_1', 'Demo Account 1', '#4444FF');

INSERT INTO "accounts" (id, name, description, color)
VALUES (2, 'account_2', 'Demo Account 2', '#FF4444');


-- Categories
INSERT INTO "categories" (id, name, "type")
VALUES (1, 'Current Expenses', 'D');

INSERT INTO "categories" (id, name, "type")
VALUES (2, 'Exceptional Expenses', 'D');

INSERT INTO "categories" (id, name, "type")
VALUES (3, 'Current Revenues', 'C');

INSERT INTO "categories" (id, name, "type")
VALUES (4, 'Exceptional Revenues', 'C');

INSERT INTO "categories" (id, name, "type")
VALUES (5, 'Movements', 'M');


-- Labels
INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (1, 'Housing', '#FF4444', '', 1);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (2, 'Transportation', '#FF4444', '', 1);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (3, 'Taxes', '#FF4444', '', 1);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (4, 'Food', '#FF4444', '', 1);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (5, 'Health', '#FF4444', '', 1);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (6, 'Restaurant', '#FF4444', '', 2);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (7, 'Entertainment', '#FF4444', '', 2);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (8, 'Misc', '#FF4444', '', 2);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (9, 'Salary', '#FF4444', '', 3);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (10, 'Contribution', '#FF4444', '', 4);

INSERT INTO "labels" (id, name, color, icon, category_id)
VALUES (11, 'Savings', '#FF4444', '', 5);


-- Status
INSERT INTO "status" (id, account_id, date, value)
VALUES (1, 1, '2018-01-01', 0.00);

INSERT INTO "status" (id, account_id, date, value)
VALUES (2, 2, '2018-01-01', 0.00);


-- Transactions
INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (1, 1, '2018-01-05', '2018-01-05', '2018-01-05', 'Rent', 'RENT01', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (2, 1, '2018-01-03', '2018-01-03', '2018-01-03', 'Salary', 'SARY01', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (3, 1, '2018-01-07', '2018-01-07', '2018-01-07', 'Groceries', 'GROC01', -182.34);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (4, 2, '2018-01-08', '2018-01-08', '2018-01-08', 'Bus', 'BUS01', -3.70);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (5, 1, '2018-02-05', '2018-02-05', '2018-02-05', 'Rent', 'RENT02', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (6, 1, '2018-02-03', '2018-02-03', '2018-02-03', 'Salary', 'SARY02', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (7, 1, '2018-02-08', '2018-02-08', '2018-02-08', 'Groceries', 'GROC02', -173.05);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (8, 1, '2018-03-05', '2018-03-05', '2018-03-05', 'Rent', 'RENT03', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (9, 1, '2018-03-03', '2018-03-03', '2018-03-03', 'Salary', 'SARY03', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (10, 1, '2018-03-09', '2018-03-09', '2018-03-09', 'Groceries', 'GROC03', -150.73);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (11, 1, '2018-04-05', '2018-04-05', '2018-04-05', 'Rent', 'RENT04', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (12, 1, '2018-04-03', '2018-04-03', '2018-04-03', 'Salary', 'SARY04', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (13, 2, '2018-04-13', '2018-04-13', '2018-04-13', 'Bus', 'BUS02', -4.80);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (14, 1, '2018-04-13', '2018-04-13', '2018-04-13', 'Groceries', 'GROC04', -211.00);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (15, 1, '2018-05-05', '2018-05-05', '2018-05-05', 'Rent', 'RENT05', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (16, 2, '2018-05-04', '2018-05-04', '2018-05-04', 'Groceries', 'GROC05', -193.46);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (17, 1, '2018-05-03', '2018-05-03', '2018-05-03', 'Salary', 'SARY05', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (18, 1, '2018-05-15', '2018-05-15', '2018-05-15', 'Taxes 2017', 'TAX017', -546.30);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (19, 1, '2018-06-05', '2018-06-05', '2018-06-05', 'Rent', 'RENT06', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (20, 1, '2018-06-03', '2018-06-03', '2018-06-03', 'Salary', 'SARY06', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (21, 1, '2018-06-08', '2018-06-08', '2018-06-08', 'Groceries', 'GROC06', -163.00);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (22, 1, '2018-07-05', '2018-07-05', '2018-07-05', 'Rent', 'RENT07', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (23, 1, '2018-07-03', '2018-07-03', '2018-07-03', 'Salary', 'SARY07', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (24, 2, '2018-07-09', '2018-07-09', '2018-07-09', 'Bus', 'BUS03', -2.60);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (25, 2, '2018-07-11', '2018-07-11', '2018-07-11', 'Groceries', 'GROC07', -145.63);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (26, 1, '2018-08-05', '2018-08-05', '2018-08-05', 'Rent', 'RENT08', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (27, 1, '2018-08-03', '2018-08-03', '2018-08-03', 'Salary', 'SARY08', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (28, 1, '2018-08-09', '2018-08-09', '2018-08-09', 'Groceries', 'GROC08', -157.09);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (29, 1, '2018-09-05', '2018-09-05', '2018-09-05', 'Rent', 'RENT09', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (30, 1, '2018-09-03', '2018-09-03', '2018-09-03', 'Salary', 'SARY09', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (31, 2, '2018-09-09', '2018-09-09', '2018-09-09', 'Groceries', 'GROC09', -163.79);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (32, 1, '2018-10-05', '2018-10-05', '2018-10-05', 'Rent', 'RENT10', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (33, 1, '2018-10-03', '2018-10-03', '2018-10-03', 'Salary', 'SARY10', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (34, 1, '2018-11-05', '2018-11-05', '2018-11-05', 'Rent', 'RENT11', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (35, 2, '2018-11-22', '2018-11-22', '2018-11-22', 'Bus', 'BUS03', -7.25);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (36, 1, '2018-11-03', '2018-11-03', '2018-11-03', 'Salary', 'SARY11', 1200);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (37, 1, '2018-12-05', '2018-12-05', '2018-12-05', 'Rent', 'RENT12', -450);

INSERT INTO "transactions" (id, account_id, date_compta, date_operation, date_value, description, reference, amount)
VALUES (38, 1, '2018-12-03', '2018-12-03', '2018-12-03', 'Salary', 'SARY12', 1200);

