-- we don't know how to generate schema main (class Schema) :(
create table public."accounts"
(
  id serial primary key,
  name VARCHAR(50) unique,
  description VARCHAR(250),
  color VARCHAR(50)
)
;

create table public."categories"
(
  id serial primary key,
  name VARCHAR(250) unique,
  type varchar(10)
)
;

create table public."labels"
(
  id serial primary key,
  name VARCHAR(250) unique,
  color VARCHAR(50),
  icon VARCHAR(250),
  category_id INTEGER
)
;

create table public."status"
(
  id serial primary key,
  account_id INTEGER references accounts,
  date DATE,
  value NUMERIC(2)
)
;

create table public."transactions"
(
  id serial primary key,
  account_id INTEGER references accounts,
  date_compta DATE,
  date_operation DATE,
  date_value DATE,
  description VARCHAR(250),
  reference VARCHAR(50),
  amount NUMERIC(2),
  note VARCHAR(250),
  label_id INTEGER references labels,
  hash VARCHAR(250) unique
)
;

create table public."labels_transactions"
(
  label_id INTEGER references labels,
  transaction_id INTEGER references transactions
)
;

create table public."user"
(
  id serial primary key,
  login VARCHAR(50),
  password VARCHAR(250)
)
;