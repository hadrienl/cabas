DROP POLICY IF EXISTS "Customer" ON customer;
CREATE POLICY "Customer"
  ON customer
  FOR ALL
  USING (auth.uid() = id);
