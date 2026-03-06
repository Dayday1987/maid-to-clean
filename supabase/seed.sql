-- ================================================
-- MAID TO CLEAN SEED DATA
-- Run after schema.sql
-- ================================================

-- Insert Services
INSERT INTO services (name, description, base_price, duration_hours) VALUES
  ('Deep Cleaning', 'Comprehensive cleaning that reaches every corner, leaving your space immaculately refreshed from top to bottom.', 150.00, 4),
  ('Move In/Out Cleaning', 'Perfect for transitions. Whether moving into a new home or preparing to hand over keys, we ensure every space is spotless.', 200.00, 5),
  ('Regular Maintenance', 'Keep your space consistently fresh with scheduled cleaning services. Available weekly, bi-weekly, or monthly.', 100.00, 2),
  ('Custom Cleaning', 'Create your own cleaning package. Select specific rooms, appliances, and tasks—pay only for what you need.', 0.00, 0),
  ('Office Cleaning', 'Professional workspace cleaning to keep your business environment productive, healthy, and impressive.', 125.00, 3),
  ('Post-Construction Cleaning', 'Specialized cleaning after renovations or construction. We remove dust, debris, and residue to reveal your finished space.', 250.00, 6)
ON CONFLICT DO NOTHING;

-- Insert Add-ons
INSERT INTO add_ons (name, price, description) VALUES
  ('Oven Cleaning', 35.00, 'Deep clean inside and outside of oven'),
  ('Refrigerator Cleaning', 40.00, 'Interior and exterior refrigerator cleaning'),
  ('Interior Windows', 30.00, 'Clean all interior windows'),
  ('Laundry Service', 25.00, 'Wash, dry, and fold laundry'),
  ('Cabinet Organization', 45.00, 'Organize and clean inside cabinets'),
  ('Baseboards', 20.00, 'Detailed baseboard cleaning'),
  ('Ceiling Fans', 15.00, 'Dust and clean all ceiling fans'),
  ('Blinds Cleaning', 35.00, 'Deep clean all window blinds')
ON CONFLICT DO NOTHING;
