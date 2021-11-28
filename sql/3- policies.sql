DROP POLICY IF EXISTS "Customer" ON customer;
CREATE POLICY "Customer"
  ON customer
  FOR ALL
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Read Order" ON order;
CREATE POLICY "Read Order"
  ON order
  FOR select
  USING (auth.uid() = fk_customer);

DROP POLICY IF EXISTS "Write Order" ON order;
CREATE POLICY "Write Order"
  ON order
  FOR insert
  WITH CHECK (auth.role() = 'authenticated');
