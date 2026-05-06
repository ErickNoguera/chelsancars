CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email         VARCHAR(255),
  role          VARCHAR(50)  DEFAULT 'admin',
  is_active     BOOLEAN      DEFAULT true,
  created_at    TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inspections (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name     VARCHAR(255) NOT NULL,
  client_phone    VARCHAR(50),
  client_email    VARCHAR(255),
  vehicle_make    VARCHAR(100) NOT NULL,
  vehicle_model   VARCHAR(100) NOT NULL,
  vehicle_year    INTEGER,
  license_plate   VARCHAR(20)  NOT NULL,
  vin             VARCHAR(50),
  mileage         INTEGER,
  inspection_date DATE,
  overall_status  VARCHAR(50),
  data_json       JSONB,
  created_by      VARCHAR(100),
  created_at      TIMESTAMP    DEFAULT NOW(),
  updated_at      TIMESTAMP    DEFAULT NOW()
);
