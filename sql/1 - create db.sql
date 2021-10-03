DROP TABLE IF EXISTS customer CASCADE;
CREATE TABLE customer (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name text,
  last_name text,
  photo text,
  phone text
);
alter table customer enable row level security;

DROP TABLE IF EXISTS tag CASCADE;
CREATE TABLE tag (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  slug text,
  name text
);

DROP TABLE IF EXISTS producer CASCADE;
CREATE TABLE producer (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text,
  description text,
  photo text
);

DROP TABLE IF EXISTS product CASCADE;
CREATE TABLE product (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text,
  description text,
  photo text,
  fk_producer bigint NOT NULL REFERENCES producer(id),
  fk_tag bigint REFERENCES tag(id)  
);

DROP TABLE IF EXISTS distribution CASCADE;
CREATE TABLE distribution (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  start_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  close_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  ship_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP TABLE IF EXISTS product_in_distribution CASCADE;
CREATE TABLE product_in_distribution (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  fk_distribution bigint NOT NULL REFERENCES distribution(id),
  fk_product bigint NOT NULL REFERENCES product(id),
  unit int NOT NULL DEFAULT 1,
  unit_label text,
  per_unit int NOT NULL DEFAULT 1,
  price float NOT NULL
);
