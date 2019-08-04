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
  notify INTEGER DEFAULT 0
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
  category_id INTEGER
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