begin
  for r in ( select table_name, constraint_name from USER_CONS_COLUMNS
  where table_name = 'LAYER' AND COLUMN_NAME = 'TYPE')
  loop
    execute immediate 'alter table '||r.table_name ||' drop constraint '||r.constraint_name;
  end loop;

  execute immediate 'alter table LAYER add constraint layer_type_not_null CHECK(TYPE IS NOT NULL)';
  execute immediate 'alter table LAYER add constraint layer_type_valid CHECK(TYPE IN (''wms'', ''wfs'', ''mvt'', ''wmts'', ''agfs'', ''agfl''))';


  for r in ( select table_name, constraint_name from USER_CONS_COLUMNS
  where table_name = 'LAYER' AND COLUMN_NAME = 'DESKTOP_VISIBLE')
  loop
    execute immediate 'alter table '||r.table_name ||' drop constraint '||r.constraint_name;
  end loop;

  execute immediate 'alter table LAYER add constraint layer_desktop_visible_valid CHECK(DESKTOP_VISIBLE IN (''0'', ''1'') AND TYPE != ''agfl'' OR DESKTOP_VISIBLE = ''0'' AND TYPE = ''agfl'')';


  for r in ( select table_name, constraint_name from USER_CONS_COLUMNS
  where table_name = 'LAYER' AND COLUMN_NAME = 'MOBILE_VISIBLE')
  loop
    execute immediate 'alter table '||r.table_name ||' drop constraint '||r.constraint_name;
  end loop;

  execute immediate 'alter table LAYER add constraint layer_mobile_visible_valid CHECK (MOBILE_VISIBLE IN (''0'', ''1'') AND TYPE != ''agfl'' OR MOBILE_VISIBLE = ''0'' AND TYPE = ''agfl'')';

end;
