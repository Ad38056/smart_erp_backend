UPDATE public."User" SET role = 'ADMIN' WHERE email = 'testuser2@example.com';
SELECT id, email, role FROM public."User" WHERE email = 'testuser2@example.com';
