begin
    for r in ( select table_name, constraint_name
               from USER_CONS_COLUMNS
               where table_name = 'LAYER'
                 AND COLUMN_NAME = 'RELATION_TYPE')
        loop
            execute immediate 'alter table ' || r.table_name || ' drop constraint ' || r.constraint_name;
        end loop;
    for r in ( select table_name, constraint_name
               from USER_CONS_COLUMNS
               where table_name = 'LAYER'
                 AND COLUMN_NAME = 'RELATION_LAYER_ID')
        loop
            execute immediate 'alter table ' || r.table_name || ' drop constraint ' || r.constraint_name;
        end loop;
end;
