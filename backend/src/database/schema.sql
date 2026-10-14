-- ============================================================
--  Fast Delivery — PostgreSQL sxemasi (1-bosqich)
--  Sequelize modellari (src/models) bilan bir xil tuzilma.
--  Qo'lda ishga tushirish:  psql "$DATABASE_URL" -f src/database/schema.sql
--  Yoki ORM orqali:         npm run db:sync
-- ============================================================

DO $$ BEGIN
  CREATE TYPE enum_users_language AS ENUM ('uz', 'ru');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE enum_products_category AS ENUM ('burgers', 'pizza', 'drinks', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE enum_orders_payment_method AS ENUM ('cash', 'payme_click', 'stars');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE enum_orders_payment_status AS ENUM ('pending', 'paid', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE enum_orders_status AS ENUM ('new', 'confirmed', 'delivering', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- Foydalanuvchilar / Пользователи ----------
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  telegram_id  BIGINT       NOT NULL UNIQUE,
  first_name   VARCHAR(255),
  last_name    VARCHAR(255),
  username     VARCHAR(255),
  language     enum_users_language,          -- NULL = hali tanlanmagan
  phone        VARCHAR(32),
  address      TEXT,
  is_blocked   BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------- Mahsulotlar / Товары ----------
CREATE TABLE IF NOT EXISTS products (
  id              SERIAL PRIMARY KEY,
  slug            VARCHAR(100)  NOT NULL UNIQUE,
  category        enum_products_category NOT NULL,
  name_uz         VARCHAR(255)  NOT NULL,
  name_ru         VARCHAR(255)  NOT NULL,
  description_uz  TEXT,
  description_ru  TEXT,
  ingredients_uz  JSONB         NOT NULL DEFAULT '[]',
  ingredients_ru  JSONB         NOT NULL DEFAULT '[]',
  price           INTEGER       NOT NULL CHECK (price >= 0),   -- so'mda
  old_price       INTEGER       CHECK (old_price >= 0),        -- chizilgan eski narx
  image           VARCHAR(500),
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  is_upsell       BOOLEAN       NOT NULL DEFAULT FALSE,        -- Order Bump mahsuloti
  sort_order      INTEGER       NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS products_category_active ON products (category, is_active);

-- ---------- Buyurtmalar / Заказы ----------
-- items: buyurtma paytidagi narx va nomlarning "snapshot"i (keyin narx o'zgarsa ham tarix buzilmaydi)
--   [{ "productId": 1, "nameUz": "...", "nameRu": "...", "price": 32000, "quantity": 2 }]
CREATE TABLE IF NOT EXISTS orders (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  items               JSONB        NOT NULL,
  subtotal            INTEGER      NOT NULL,
  bump_product_id     INTEGER      REFERENCES products (id) ON DELETE SET NULL,
  bump_price          INTEGER      NOT NULL DEFAULT 0,
  total               INTEGER      NOT NULL,
  payment_method      enum_orders_payment_method NOT NULL,
  payment_status      enum_orders_payment_status NOT NULL DEFAULT 'pending',
  status              enum_orders_status         NOT NULL DEFAULT 'new',
  address             TEXT         NOT NULL,
  phone               VARCHAR(32),
  comment             TEXT,
  stars_amount        INTEGER,
  payment_charge_id   VARCHAR(255),
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS orders_status ON orders (status);
