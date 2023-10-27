CREATE DATABASE impensa_server_node;

\c impensa_server_node

CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  user_id UUID DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_currency VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE expenses(
  expense_id UUID DEFAULT uuid_generate_v4(),
  expense_amount NUMERIC NOT NULL,
  expense_description VARCHAR(255) NOT NULL,
  expense_category VARCHAR(255) NOT NULL,
  expense_date timestamptz NOT NULL DEFAULT now(),
  user_id UUID,
  PRIMARY KEY (expense_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)  
);
