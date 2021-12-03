DROP POLICY IF EXISTS "Customer" ON customer;
CREATE POLICY "Customer"
  ON customer
  FOR ALL
  USING (auth.uid() = id);

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
