-- update_service_icons.sql
-- This script updates the missing Font Awesome icons for the newly created services

UPDATE public.services SET icon = 'fas fa-crutch' WHERE title = 'Knee Pain';
UPDATE public.services SET icon = 'fas fa-bone' WHERE title = 'Back Pain';
UPDATE public.services SET icon = 'fas fa-child' WHERE title = 'Shoulder Pain';
UPDATE public.services SET icon = 'fas fa-user-injured' WHERE title = 'Neck Pain';
UPDATE public.services SET icon = 'fas fa-brain' WHERE title = 'Headache';
UPDATE public.services SET icon = 'fas fa-walking' WHERE title = 'Hip Pain';
UPDATE public.services SET icon = 'fas fa-hand' WHERE title = 'Wrist Pain';
UPDATE public.services SET icon = 'fas fa-shoe-prints' WHERE title = 'Foot & Ankle Pain';
UPDATE public.services SET icon = 'fas fa-hand-holding' WHERE title = 'Elbow Pain';
UPDATE public.services SET icon = 'fas fa-heartbeat' WHERE title = 'Chest Pain';
