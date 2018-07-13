BEGIN;

-- as superuser
-- CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS
users (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  username CITEXT UNIQUE,
  modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- force lowercase emails
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_lowercase_ck;
ALTER TABLE users
  ADD CONSTRAINT users_email_lowercase_ck
  CHECK (email = lower(email));

-- force max length emails <= 254
-- https://tools.ietf.org/html/rfc5321#section-4.5.3
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_max_length_ck;
ALTER TABLE users
  ADD CONSTRAINT users_email_max_length_ck
  CHECK (length(email) <= 254);

-- update modified time on update
CREATE OR REPLACE FUNCTION update_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = now();
    RETURN NEW;
END;
$$ language 'plpgsql';
DROP TRIGGER IF EXISTS update_user_modified ON users;
CREATE TRIGGER update_user_modified
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_modified();

-- cast email always lowercase
CREATE OR REPLACE FUNCTION lower_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email = lower(NEW.email);
  RETURN NEW;
END;

$$ LANGUAGE 'plpgsql';
DROP TRIGGER IF EXISTS lower_email_on_update ON users;
CREATE TRIGGER lower_email_on_update
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE lower_email();
DROP TRIGGER IF EXISTS lower_email_on_insert ON users;
CREATE TRIGGER lower_email_on_insert
  BEFORE INSERT ON users
  FOR EACH ROW EXECUTE PROCEDURE lower_email();

COMMIT;

