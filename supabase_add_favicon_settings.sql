-- Add Favicon Configuration to site_settings
insert into public.site_settings (key, value, label, type)
values 
  ('favicon_type', '"image"', 'Favicon Type', 'text'),
  ('favicon_url', '""', 'Favicon Image URL', 'text'),
  ('favicon_icon', '"fa-solid fa-star"', 'Favicon FontAwesome Icon', 'text'),
  ('favicon_icon_color', '"#f59e0b"', 'Favicon Icon Color', 'text')
on conflict (key) do update set 
  label = excluded.label,
  type = excluded.type;
