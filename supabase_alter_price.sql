-- Run this script to convert the 'price' column to bigint (whole number).
-- It handles conversion by stripping non-numeric characters, effectively attempting to save existing numbers.
-- "1 Cr" will likely become 1, "1,00,000" becomes 100000.
-- Any completely non-numeric value will be NULL (or 0 if coalesced).

DO $$
BEGIN
    -- Check if column is currently text before altering to avoid errors if run twice on verified schema
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'items' 
        AND column_name = 'price' 
        AND data_type = 'text'
    ) THEN
        ALTER TABLE public.items 
        ALTER COLUMN price 
        TYPE bigint 
        USING (regexp_replace(price, '[^0-9]', '', 'g')::bigint);
    END IF;
END $$;
