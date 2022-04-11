DROP POLICY IF EXISTS "Customer" ON customer;
CREATE POLICY "Customer"
  ON customer
  FOR ALL
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "user_access" ON user_access;
CREATE POLICY "user_access"
  ON user_access
  for select
  using (auth.uid() = id);

DROP POLICY IF EXISTS "Read Order" ON indent;
CREATE POLICY "Read Order"
  ON indent
  FOR select
  USING (auth.uid() = fk_customer);

DROP POLICY IF EXISTS "Write Order" ON indent;
CREATE POLICY "Write Order"
  ON indent
  FOR insert
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Update Order" ON indent;
CREATE POLICY "Update Order"
  ON indent
  FOR update
  USING (auth.uid() = fk_customer and status = 'pending')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Read Order products" ON product_in_indent;
CREATE POLICY "Read Order products"
  ON product_in_indent
  FOR all
  USING (fk_indent in (select id from indent where fk_customer = auth.uid()));

-- Admin
DROP POLICY IF EXISTS "Admin Customer" ON customer;
CREATE POLICY "Admin Customer"
  ON customer
  FOR ALL
  USING (exists(select access ->> 'orders' from user_access where id = auth.uid()));
DROP POLICY IF EXISTS "Admin Orders" ON indent;
CREATE POLICY "Admin Orders"
  ON indent
  FOR all
  USING (exists(select access ->> 'orders' from user_access where id = auth.uid()));

-- Images
DROP POLICY IF EXISTS "Images read" ON storage.objects;
CREATE POLICY "Images read" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Images insert" ON storage.objects;
CREATE POLICY "Images insert" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'images' AND
    (select true from user_access where (access->'catalog'->>'write')::boolean and id = auth.uid()));

DROP POLICY IF EXISTS "Images update" ON storage.objects;
CREATE POLICY "Images update" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'images' AND
    (select true from user_access where (access->'catalog'->>'write')::boolean and id = auth.uid()));
