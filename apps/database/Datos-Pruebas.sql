-- Insertar datos iniciales
INSERT INTO roles (name, permissions)
VALUES (
    'admin',
    '["read", "write", "delete", "manage_users", "manage_students", "manage_payments"]'
  ),
  (
    'secretary',
    '["read", "write", "manage_students", "manage_payments"]'
  );
INSERT INTO sedes (name, code)
VALUES (
    'Sede Principal',
    'SD001'
  ),
  (
    'Sede Norte',
    'SD002'
  );
INSERT INTO registration_processes (name, code)
VALUES (
    'Proceso Regular',
    'PR001'
  ),
  (
    'Proceso Extraordinario',
    'PR002'
  );
INSERT INTO turns (name, start_time, end_time)
VALUES ('Mañana', '08:00:00', '12:00:00'),
  ('Tarde', '14:00:00', '18:00:00'),
  ('Noche', '18:00:00', '22:00:00');
INSERT INTO payment_plans (name, code, price, installments, description)
VALUES ('Mensual', 'PP001', 500.00, 10, 'Pago mensual'),
  (
    'Semestral',
    'PP002',
    2500.00,
    2,
    'Pago por semestre'
  ),
  (
    'Anual',
    'PP003',
    4500.00,
    1,
    'Pago anual con descuento'
  );