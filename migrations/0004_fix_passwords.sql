-- Fix password hashes for demo users

UPDATE users SET password_hash = 'simple_hash_39c43b7d' WHERE email = 'admin@eshop.cz';
UPDATE users SET password_hash = 'simple_hash_69a0366c' WHERE email = 'zakaznik@test.cz';