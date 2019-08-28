-- Since Sqlite does not support schema, remove the 'public' schema

DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "categories";
DROP TABLE IF EXISTS "status";
DROP TABLE IF EXISTS "transactions";
DROP TABLE IF EXISTS "accounts";
DROP TABLE IF EXISTS "labels";

CREATE TABLE "accounts"
(
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  description VARCHAR(250),
  color VARCHAR(50),
  notify INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1
)
;

CREATE TABLE "categories"
(
  id INTEGER PRIMARY KEY,
  name VARCHAR(250) UNIQUE,
  type VARCHAR(10)
)
;

CREATE TABLE "labels"
(
  id INTEGER PRIMARY KEY,
  name VARCHAR(250) UNIQUE,
  color VARCHAR(50),
  icon VARCHAR(250),
  category_id INTEGER REFERENCES categories
)
;

CREATE TABLE "status"
(
  id INTEGER PRIMARY KEY,
  account_id INTEGER REFERENCES accounts,
  date DATE,
  value NUMERIC(25, 2)
)
;

CREATE TABLE "transactions"
(
  id INTEGER PRIMARY KEY,
  account_id INTEGER REFERENCES accounts,
  date_compta DATE,
  date_operation DATE,
  date_value DATE,
  description VARCHAR(250),
  reference VARCHAR(50),
  amount NUMERIC(25, 2),
  note VARCHAR(250),
  label_id INTEGER REFERENCES labels,
  hash VARCHAR(250) UNIQUE
)
;

CREATE TABLE "user"
(
  id INTEGER PRIMARY KEY,
  login VARCHAR(50),
  password VARCHAR(250)
)
;

CREATE TABLE "budgets"
(
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  description VARCHAR(250),
  period VARCHAR(50),
  amount NUMERIC(25, 2)
)
;

CREATE TABLE "budgets_accounts"
(
  budget_id INTEGER REFERENCES budgets NULL,
  account_id INTEGER REFERENCES accounts NULL,
  PRIMARY KEY (budget_id, account_id)
)
;

CREATE TABLE "budgets_labels"
(
  budget_id INTEGER REFERENCES budgets NULL,
  label_id INTEGER REFERENCES labels NULL,
  PRIMARY KEY (budget_id, label_id)
)
;
