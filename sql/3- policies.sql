DROP POLICY IF EXISTS "Customer" ON customer;
CREATE POLICY "Customer"
  ON customer
  FOR ALL
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Read Basket" ON basket;
CREATE POLICY "Read Basket"
  ON basket
  FOR select
  USING (auth.uid() = fk_customer);

DROP POLICY IF EXISTS "Write Basket" ON basket;
CREATE POLICY "Write Basket"
  ON basket
  FOR insert
  WITH CHECK (auth.role() = 'authenticated');
