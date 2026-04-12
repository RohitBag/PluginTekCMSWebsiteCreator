-- Run this script to remove the 'type' column from the items table.

do $$
begin
    if exists (select 1 from information_schema.columns where table_name = 'items' and column_name = 'type') then
        alter table public.items drop column "type";
    end if;
end $$;
