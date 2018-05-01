-- we don't know how to generate schema main (class Schema) :(
CREATE TABLE public."accounts"
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  description VARCHAR(250),
  color VARCHAR(50)
)
;

CREATE TABLE public."categories"
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) UNIQUE,
  type VARCHAR(10)
)
;

CREATE TABLE public."labels"
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) UNIQUE,
  color VARCHAR(50),
  icon VARCHAR(250),
  category_id INTEGER
)
;

CREATE TABLE public."status"
(
  id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES accounts,
  date DATE,
  value NUMERIC(25, 2)
)
;

CREATE TABLE public."transactions"
(
  id SERIAL PRIMARY KEY,
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

CREATE TABLE public."labels_transactions"
(
  label_id INTEGER references labels,
  transaction_id INTEGER references transactions
)
;

CREATE TABLE public."user"
(
  id SERIAL PRIMARY KEY,
  login VARCHAR(50),
  password VARCHAR(250)
)
;