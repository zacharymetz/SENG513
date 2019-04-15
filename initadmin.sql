INSERT INTO public.account( email, passworddigest, firstname, created_at) VALUES ( 'example@example.com', 'password', 'admin',  now());	
INSERT INTO public.accountinstitution( accountid, institutionid, permission) VALUES ( 1, 0, '*');
