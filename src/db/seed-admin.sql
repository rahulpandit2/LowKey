-- ============================================================================
-- LowKey — Seed Default Admin User
-- Username: admin
-- Password: P@ssword123
-- ============================================================================
-- Run this script only if no admin user exists yet.
-- Uses pgcrypto's crypt() for password hashing (bcrypt, cost 10).

DO $$
DECLARE
  v_user_id UUID;
  v_existing_admin UUID;
BEGIN
  -- Check if any admin already exists
  SELECT au.user_id INTO v_existing_admin
  FROM admin_users au
  WHERE au.is_active = true
  LIMIT 1;

  IF v_existing_admin IS NOT NULL THEN
    RAISE NOTICE 'Admin already exists (user_id: %). Skipping seed.', v_existing_admin;
    RETURN;
  END IF;

  -- Check if 'admin' username already exists
  SELECT id INTO v_user_id FROM users WHERE username = 'admin' LIMIT 1;

  IF v_user_id IS NULL THEN
    -- Create the admin user
    INSERT INTO users (
      username, email, password_hash, role, status,
      email_verified, onboarding_completed
    )
    VALUES (
      'admin',
      'admin@lowkey.internal',
      crypt('P@ssword123', gen_salt('bf', 10)),
      'admin',
      'active',
      true,
      true
    )
    RETURNING id INTO v_user_id;

    -- Create profile
    INSERT INTO profiles (user_id, display_name, bio)
    VALUES (v_user_id, 'Server Admin', 'Default system administrator');

    RAISE NOTICE 'Created admin user (id: %)', v_user_id;
  ELSE
    RAISE NOTICE 'User "admin" already exists (id: %). Promoting to admin.', v_user_id;
  END IF;

  -- Create admin record
  INSERT INTO admin_users (user_id, admin_role, is_active, mfa_enabled)
  VALUES (v_user_id, 'super_admin', true, false)
  ON CONFLICT (user_id) DO UPDATE SET
    admin_role = 'super_admin',
    is_active = true;

  RAISE NOTICE 'Admin setup complete. Login: username=admin, password=P@ssword123';
END $$;
