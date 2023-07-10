CREATE DATABASE banking_system;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  user_uid uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  firstname VARCHAR(64) NOT NULL,
  lastname VARCHAR(64) NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL CHECK(length(password) >= 6)
);

CREATE TABLE cards(
  card_uid uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  card_number BIGINT NOT NULL UNIQUE,
  type_of_card VARCHAR(32) NOT NULL,
  issue_date DATE NOT NULL,
  balance DOUBLE PRECISION NOT NULL,
  user_uid uuid NOT NULL UNIQUE,
  FOREIGN KEY(user_uid)
    REFERENCES users(user_uid)
);

CREATE TABLE cashback_cards(
  cashback_card_uid uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  balance DOUBLE PRECISION NOT NULL,
  user_uid uuid NOT NULL UNIQUE,
  FOREIGN KEY(user_uid)
    REFERENCES users(user_uid)
);

CREATE TABLE stores(
  store_uid uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  name VARCHAR(64) NOT NULL,
  balance DOUBLE PRECISION NOT NULL
);

INSERT INTO stores(name, balance)
VALUES('Uzum market', 5000);

CREATE TABLE histories(
    history_uid uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_uid uuid NOT NULL,
    FOREIGN KEY(user_uid)
        REFERENCES users(user_uid),
    sender VARCHAR(128) NOT NULL,
    reciever VARCHAR(128) NOT NULL,
    amount BIGINT NOT NULL,
    transacted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE app(
  app_uid uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  name VARCHAR(64) NOT NULL,
  balance DOUBLE PRECISION NOT NULL
);

INSERT INTO app(name, balance)
VALUES('MaestroPay', 0);

